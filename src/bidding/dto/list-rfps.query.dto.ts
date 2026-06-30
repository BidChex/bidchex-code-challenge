import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import type { RfpStatus } from '../domain/types';

const STATUSES: RfpStatus[] = ['OPEN', 'AWARDED', 'SETTLED', 'CANCELLED'];

/**
 * Query parameters for GET /rfps. Parsed and validated at the boundary: an
 * invalid status or out-of-range paging value is a 400, never a silent default.
 */
export class ListRfpsQueryDto {
  @IsOptional()
  @IsIn(STATUSES)
  status?: RfpStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
