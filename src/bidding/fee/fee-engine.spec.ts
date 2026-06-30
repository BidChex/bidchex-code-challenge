import { computeFee } from './fee-engine';

/**
 * Starter unit tests for the fee engine. Replace the `it.todo` stubs with real
 * tests. These are YOUR tests: we expect you to cover the rounding, the marginal
 * tiering, the conservation invariant, and the malformed-policy cases.
 */
describe('computeFee', () => {
  it.todo('PERCENTAGE rounds half-up to the nearest cent');
  it.todo('FLAT fee never exceeds the amount');
  it.todo('TIERED applies brackets marginally');
  it.todo('platformFee + vendorPayout always equals the amount');
  it.todo('throws INVALID_FEE_POLICY for malformed policies');

  // Example to get you started (delete or expand):
  it('exists', () => {
    expect(typeof computeFee).toBe('function');
  });
});
