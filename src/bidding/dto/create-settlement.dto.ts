import { IsObject, IsString, MinLength } from 'class-validator';
import type { FeePolicy } from '../domain/types';

export class CreateSettlementDto {
  @IsString()
  @MinLength(1)
  rfpId!: string;

  @IsString()
  @MinLength(1)
  idempotencyKey!: string;

  /**
   * The fee policy is validated structurally in the service (it is a discriminated
   * union, not a flat DTO). Reject malformed policies with INVALID_FEE_POLICY.
   */
  @IsObject()
  feePolicy!: FeePolicy;
}
