# Challenge specification — RFP & Bid Settlement Service

You are building a small backend service for a procurement flow (a simplified version of what
we actually do at BidChex). A client posts an **RFP** (request for proposal) for some work.
**Vendors** submit **bids**. The client **awards** exactly one bid. The awarded bid is then
**settled**, applying a configurable platform fee that splits the awarded amount into a
platform fee and a vendor payout.

Stack is fixed: **NestJS + TypeScript**, in-memory storage (no database needed). The skeleton
is already wired (controller, module, DTOs, error filter). You implement the domain.

> **Money is always integer cents (USD).** Never use floating point for money. Ever.

---

## Domain model

- **RFP**: `{ id, title, budgetCapCents, submissionDeadline, status, awardedBidId, createdAt }`
  - `status`: `OPEN` → `AWARDED` → `SETTLED`. (`CANCELLED` exists in the type but you do not
    need an endpoint for it.)
- **Bid**: `{ id, rfpId, vendorId, amountCents, lineItems[], status, overBudget, submittedAt }`
  - `status`: `ACTIVE | SUPERSEDED | AWARDED | REJECTED`.
- **LineItem**: `{ description, quantity (int > 0), unitPriceCents (int >= 0) }`.
- **Settlement**: `{ id, rfpId, idempotencyKey, awardedAmountCents, platformFeeCents, vendorPayoutCents, status, settledAt }`.
- **FeePolicy** (discriminated union), applied at settlement to the awarded amount:
  - `{ type: 'PERCENTAGE', bps }` — basis points, e.g. `250` = 2.50%.
  - `{ type: 'FLAT', cents }` — a fixed fee in cents.
  - `{ type: 'TIERED', tiers: [{ uptoCents, bps }] }` — **marginal** brackets (like income tax).
    The final tier has `uptoCents: null` ("and everything above").

The exact TypeScript shapes are in [`src/bidding/domain/types.ts`](./src/bidding/domain/types.ts).

---

## HTTP contract

All error responses use the envelope `{ "error": "<CODE>", "message": "<text>" }`. The mapping
from domain error code to HTTP status is already implemented in
[`src/bidding/domain/errors.ts`](./src/bidding/domain/errors.ts). You just throw the typed
`DomainError`; the filter does the rest.

### `POST /rfps` → `201`
Body: `{ title, budgetCapCents, submissionDeadline }`.
- `budgetCapCents` must be an integer `>= 1`; `submissionDeadline` must be a valid ISO 8601 date.
- The deadline must be **in the future** → otherwise `422 RFP_DEADLINE_IN_PAST`.
- Returns the created RFP with `status: "OPEN"`, `awardedBidId: null`.

### `POST /rfps/:id/bids` → `201`
Body: `{ vendorId, amountCents, lineItems: [{ description, quantity, unitPriceCents }] }`.
- RFP must exist (`404 RFP_NOT_FOUND`) and be `OPEN` (`409 RFP_NOT_OPEN`).
- `now` must be before the deadline → otherwise `422 BID_AFTER_DEADLINE`.
- `amountCents` must equal `sum(quantity * unitPriceCents)` over the line items → otherwise
  `422 BID_AMOUNT_MISMATCH`.
- If `amountCents > budgetCapCents`, the bid is **still accepted** but flagged `overBudget: true`.
  (This is a deliberate business rule: over-budget bids are allowed and surfaced, not rejected.)
- **One ACTIVE bid per vendor per RFP**: if the same `vendorId` submits again, the previous
  ACTIVE bid for that vendor becomes `SUPERSEDED` and the new one is `ACTIVE`.
- Returns the created bid with `status: "ACTIVE"` and the `overBudget` flag.

### `POST /rfps/:id/award` → `200`
Body: `{ bidId }`.
- RFP must exist and the bid must exist on that RFP (`404 BID_NOT_FOUND`).
- Cannot award after the deadline → `422 AWARD_AFTER_DEADLINE`.
- Awarding sets RFP `AWARDED` + `awardedBidId`, the chosen bid `AWARDED`, and **all other
  ACTIVE bids** `REJECTED`.
- **Idempotent**: awarding the *same* bid again is a success no-op (`200`). Awarding a
  *different* bid once the RFP is already awarded → `409 ALREADY_AWARDED`.
- Returns the RFP detail (same shape as `GET /rfps/:id`).

### `POST /rfps/:id/cancel` → `200`
No body.
- Cancelling an `OPEN` or `AWARDED` RFP sets it to `CANCELLED` and marks every still-`ACTIVE`
  bid `REJECTED`.
- **Idempotent**: cancelling an already-`CANCELLED` RFP is a success no-op (`200`).
- A `SETTLED` RFP cannot be cancelled → `409 RFP_NOT_CANCELLABLE`.
- After cancellation the RFP is no longer `OPEN`, so new bids are rejected (`409 RFP_NOT_OPEN`).
- Returns the RFP detail.

### `POST /settlements` → `201`
Body: `{ rfpId, idempotencyKey, feePolicy }`.
- RFP must be `AWARDED` → otherwise `409 RFP_NOT_AWARDED`.
- Compute the fee on the **awarded bid amount** per the policy (see the fee rules below).
- **Idempotent on `idempotencyKey`**: replaying the exact same request returns the **same**
  stored settlement (same `id`, same numbers). A request with a **different** key for an
  already-settled RFP → `409 ALREADY_SETTLED`.
- Settling sets the RFP `SETTLED`.
- Returns the settlement.

### `GET /rfps/:id` → `200`
Returns the RFP plus `bids: Bid[]` and `settlement: Settlement | null`.

### `GET /rfps` → `200` (list with filter + pagination)
Query: `?status=&limit=&offset=`.
- `status` optional; if present it must be a valid `RfpStatus` → otherwise `400`.
- `limit` optional, default `20`, range `1..100` → otherwise `400`.
- `offset` optional, default `0`, `>= 0` → otherwise `400`.
- Returns `{ items: Rfp[], total, limit, offset }` where `total` is the count matching the
  filter **ignoring paging**, and `items` is the requested page.
- Ordering is deterministic: `createdAt` descending, ties broken by `id` ascending.
- Do not silently coerce bad input. Validate at the boundary; never return `[]` to hide an error.

### `GET /rfps/:id/events` → `200`
Returns the ordered `RfpEvent[]` for that RFP (`404 RFP_NOT_FOUND` if it does not exist). See
the events contract below.

---

## Events contract

Every state transition appends **exactly one** `RfpEvent` (`{ type, at, bidId }`) to the RFP's
log, in order. `bidId` is the bid the event is about, or `null` for RFP-level events. Emission
rules:

| Action                    | Events appended (in this order)                                  |
| ------------------------- | ---------------------------------------------------------------- |
| create RFP                | `RFP_CREATED` (bidId null)                                        |
| submit a first bid        | `BID_SUBMITTED` (the new bid)                                     |
| resubmit (supersede)      | `BID_SUPERSEDED` (old bid), then `BID_SUBMITTED` (new bid)        |
| award                     | `RFP_AWARDED` (awarded bid), then one `BID_REJECTED` per loser    |
| settle                    | `RFP_SETTLED` (bidId null)                                        |
| cancel                    | one `BID_REJECTED` per still-active bid, then `RFP_CANCELLED`     |

Losers/active bids are emitted in submission order. Centralize event recording (do not scatter
`events.push(...)` across every method); a reader should find one place that owns transitions.

---

## Fee engine rules (the tricky part)

Implement [`src/bidding/fee/fee-engine.ts`](./src/bidding/fee/fee-engine.ts).

- **PERCENTAGE**: `fee = round_half_up(amount * bps / 10_000)`.
- **FLAT**: `fee = min(cents, amount)` (a flat fee may never exceed the amount).
- **TIERED**: marginal. Each tier's `bps` applies only to the portion of the amount that falls
  inside that tier; round each tier's marginal fee half-up, then sum.
- **Bounds (optional, any policy type):** a policy may also carry `minFeeCents` and/or
  `maxFeeCents`. After the base fee is computed, clamp it: `fee = max(minFeeCents ?? 0, fee)`,
  then `fee = min(maxFeeCents ?? amount, fee)`, then cap at the amount. If both are present and
  `minFeeCents > maxFeeCents`, reject with `422 INVALID_FEE_POLICY`.
- Reject malformed policies (negative `bps`/`cents`, tiers not strictly increasing, missing
  final `uptoCents: null` tier, bad bounds, ...) with `422 INVALID_FEE_POLICY`.

**Hard invariant:** `platformFeeCents + vendorPayoutCents === awardedAmountCents`, always.
Rounding must never create or destroy a cent.

### Worked examples (use these to check yourself)

| Amount  | Policy                                                       | Fee    | Payout  |
| ------- | ----------------------------------------------------------- | ------ | ------- |
| 12_345  | `PERCENTAGE bps=250` (2.50% = 308.625)                       | 309    | 12_036  |
| 100_000 | `TIERED [{upto 50_000, bps 300},{upto null, bps 100}]`       | 2_000  | 98_000  |
| 50_000  | `FLAT cents=1_000`                                           | 1_000  | 49_000  |
| 1_000   | `PERCENTAGE bps=250, minFeeCents=50` (base 25, raised)       | 50     | 950     |
| 100_000 | `PERCENTAGE bps=500, maxFeeCents=3_000` (base 5000, capped)  | 3_000  | 97_000  |

---

## Acceptance criteria

- `npm run check` is green (typecheck + all tests).
- The acceptance tests in `test/acceptance.e2e-spec.ts` pass **unmodified**.
- You added your own unit tests, at minimum for: the fee engine (percentage rounding, tiered
  marginal math, min/max bounds, the conservation invariant, malformed policies) and the state
  machine (supersede, award, cancel transitions, idempotency, the event log ordering).

### Optional stretch (not required, not graded)
If you finish early and want to show off, these are natural extensions: bid withdrawal (a vendor
retracts an `ACTIVE` bid), and deadline extension (`PATCH /rfps/:id` that only ever moves the
deadline later). Implement them only after the required scope is solid.

## What we are evaluating (read this)

This mirrors how we write code at BidChex. We care about:

1. **Correctness by construction.** Model state so illegal states are hard to represent
   (use the status unions, do not lean on scattered booleans). Validate input **once** at the
   boundary, then trust your types.
2. **No silent fallbacks.** Never return `[]`, `null`, `0`, or a default object to hide a
   failure. Fail loud with a typed `DomainError`.
3. **Money discipline.** Integer cents, conservation invariant, deliberate rounding.
4. **Thin controller, logic in the service.** Small, well-named functions. A reader should
   follow the flow without untangling nested `if` ladders.
5. **Tests that pin the tricky rules**, not just the happy path.
6. **How you drove the AI.** We will read your prompts and chat export. Show us where you
   caught the AI being wrong, over-engineering, or cutting a corner, and how you fixed it.

You do not need to add auth, a database, Swagger, or extra endpoints. Resist scope creep
(YAGNI). Depth on the spec beats breadth.
