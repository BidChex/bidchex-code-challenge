import { DomainError } from '../domain/errors';
import type { Cents, FeePolicy } from '../domain/types';

export interface FeeBreakdown {
  readonly platformFeeCents: Cents;
  readonly vendorPayoutCents: Cents;
}

/**
 * Compute the platform fee and vendor payout for an awarded amount.
 *
 * Rules (see CHALLENGE.md for the full spec):
 *  - PERCENTAGE: fee = amount * bps / 10_000, rounded HALF-UP to the nearest cent.
 *  - FLAT: fee = cents (capped at the amount; a flat fee may never exceed the amount).
 *  - TIERED: marginal brackets (like tax). Each tier's bps applies only to the
 *    portion of the amount within that tier. The final tier has uptoCents = null.
 *    Each tier's marginal fee is rounded HALF-UP, then summed.
 *
 * BOUNDS (optional, any policy type): after computing the base fee, clamp it:
 *   fee = max(minFeeCents ?? 0, fee); fee = min(maxFeeCents ?? amount, fee);
 * then cap at the amount. Reject minFeeCents > maxFeeCents with INVALID_FEE_POLICY.
 *
 * INVARIANT (must always hold): platformFeeCents + vendorPayoutCents === amountCents.
 * Money must never be created or destroyed by rounding.
 *
 * Throw `new DomainError('INVALID_FEE_POLICY', ...)` for malformed policies
 * (negative bps, negative cents, non-monotonic or missing final tier, bad bounds).
 */
export function computeFee(amountCents: Cents, policy: FeePolicy): FeeBreakdown {
  // TODO(candidate): implement. Delete this throw.
  void amountCents;
  void policy;
  throw new DomainError('INVALID_FEE_POLICY', 'computeFee not implemented');
}
