/**
 * Domain types for the RFP & Bid Settlement service.
 *
 * These types are the contract your implementation must honor. You may ADD to
 * them (more precise unions, branded types, value objects) but the public shapes
 * returned by the API must stay compatible with CHALLENGE.md.
 *
 * Money is ALWAYS integer cents (USD). Never use floats for money.
 */

export type Cents = number;

export type RfpStatus = 'OPEN' | 'AWARDED' | 'SETTLED' | 'CANCELLED';

export type BidStatus = 'ACTIVE' | 'SUPERSEDED' | 'AWARDED' | 'REJECTED';

export interface LineItem {
  readonly description: string;
  readonly quantity: number; // integer > 0
  readonly unitPriceCents: Cents; // integer >= 0
}

export interface Bid {
  readonly id: string;
  readonly rfpId: string;
  readonly vendorId: string;
  readonly amountCents: Cents;
  readonly lineItems: ReadonlyArray<LineItem>;
  readonly status: BidStatus;
  readonly overBudget: boolean;
  readonly submittedAt: string; // ISO 8601
}

export interface Rfp {
  readonly id: string;
  readonly title: string;
  readonly budgetCapCents: Cents;
  readonly submissionDeadline: string; // ISO 8601
  readonly status: RfpStatus;
  readonly awardedBidId: string | null;
  readonly createdAt: string; // ISO 8601
}

/**
 * Optional fee bounds, applied AFTER the base fee is computed, for ANY policy
 * type. The fee is clamped: max(minFeeCents, fee) then min(maxFeeCents, fee),
 * and finally capped at the amount. Both are optional and independent.
 */
export interface FeeBounds {
  readonly minFeeCents?: Cents;
  readonly maxFeeCents?: Cents;
}

/**
 * Fee policies applied to the awarded amount at settlement time.
 * Discriminated union on `type`, intersected with the optional bounds above.
 */
export type FeePolicy = (
  | { readonly type: 'PERCENTAGE'; readonly bps: number } // basis points, e.g. 250 = 2.50%
  | { readonly type: 'FLAT'; readonly cents: Cents }
  | { readonly type: 'TIERED'; readonly tiers: ReadonlyArray<FeeTier> }
) &
  FeeBounds;

/**
 * A marginal tier. `uptoCents: null` means "and everything above" (the final tier).
 * Tiers apply marginally, like income tax brackets.
 */
export interface FeeTier {
  readonly uptoCents: Cents | null;
  readonly bps: number;
}

export interface Settlement {
  readonly id: string;
  readonly rfpId: string;
  readonly idempotencyKey: string;
  readonly awardedAmountCents: Cents;
  readonly platformFeeCents: Cents;
  readonly vendorPayoutCents: Cents;
  readonly status: 'SETTLED';
  readonly settledAt: string; // ISO 8601
}

/**
 * Domain events recorded for each RFP, in the order they happened. Every state
 * transition appends exactly one event. See CHALLENGE.md for the exact emission
 * rules and ordering (this is part of the contract, GET /rfps/:id/events).
 */
export type RfpEventType =
  | 'RFP_CREATED'
  | 'BID_SUBMITTED'
  | 'BID_SUPERSEDED'
  | 'RFP_AWARDED'
  | 'BID_REJECTED'
  | 'RFP_SETTLED'
  | 'RFP_CANCELLED';

export interface RfpEvent {
  readonly type: RfpEventType;
  readonly at: string; // ISO 8601
  readonly bidId: string | null; // the bid this event is about, or null for RFP-level events
}

/** Generic page envelope for list endpoints. */
export interface Paginated<T> {
  readonly items: ReadonlyArray<T>;
  readonly total: number; // total matching the filter, ignoring paging
  readonly limit: number;
  readonly offset: number;
}
