/**
 * Typed domain errors. The domain throws these; the boundary (DomainExceptionFilter)
 * maps each code to an HTTP status. Do NOT throw raw strings, and do NOT swallow
 * these into default return values.
 */

export type DomainErrorCode =
  | 'RFP_NOT_FOUND'
  | 'RFP_NOT_OPEN'
  | 'RFP_DEADLINE_IN_PAST'
  | 'BID_AFTER_DEADLINE'
  | 'BID_AMOUNT_MISMATCH'
  | 'BID_NOT_FOUND'
  | 'AWARD_AFTER_DEADLINE'
  | 'ALREADY_AWARDED'
  | 'RFP_NOT_AWARDED'
  | 'ALREADY_SETTLED'
  | 'RFP_NOT_CANCELLABLE'
  | 'INVALID_FEE_POLICY';

/** HTTP status each domain error maps to. */
export const DOMAIN_ERROR_STATUS: Record<DomainErrorCode, number> = {
  RFP_NOT_FOUND: 404,
  BID_NOT_FOUND: 404,
  RFP_NOT_OPEN: 409,
  ALREADY_AWARDED: 409,
  RFP_NOT_AWARDED: 409,
  ALREADY_SETTLED: 409,
  RFP_NOT_CANCELLABLE: 409,
  RFP_DEADLINE_IN_PAST: 422,
  BID_AFTER_DEADLINE: 422,
  BID_AMOUNT_MISMATCH: 422,
  AWARD_AFTER_DEADLINE: 422,
  INVALID_FEE_POLICY: 422,
};

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'DomainError';
  }
}
