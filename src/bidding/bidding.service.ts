import { Injectable, NotImplementedException } from '@nestjs/common';
import type { Bid, Paginated, Rfp, RfpEvent, Settlement } from './domain/types';
import type { CreateRfpDto } from './dto/create-rfp.dto';
import type { SubmitBidDto } from './dto/submit-bid.dto';
import type { CreateSettlementDto } from './dto/create-settlement.dto';
import type { ListRfpsQueryDto } from './dto/list-rfps.query.dto';

export interface RfpDetail extends Rfp {
  readonly bids: ReadonlyArray<Bid>;
  readonly settlement: Settlement | null;
}

/**
 * In-memory store is fine for this challenge (no database required). Keep the
 * domain logic here in the service; keep the controller thin. Model state so
 * illegal transitions are hard to express, validate input once at the boundary,
 * and fail loud with typed DomainError. Do not return defaults to mask failure.
 *
 * Every method below is a stub. Implement them so the acceptance tests pass,
 * then add your own unit tests (especially for the fee engine and the state
 * machine). You may add private helpers, repositories, value objects, etc.
 *
 * Tip: every state transition must also append exactly one RfpEvent (see the
 * events contract in CHALLENGE.md). Centralize that so you do not scatter event
 * writes across the codebase.
 */
@Injectable()
export class BiddingService {
  // TODO(candidate): choose your own internal storage shape.

  createRfp(_dto: CreateRfpDto): Rfp {
    throw new NotImplementedException('createRfp');
  }

  listRfps(_query: ListRfpsQueryDto): Paginated<Rfp> {
    throw new NotImplementedException('listRfps');
  }

  submitBid(_rfpId: string, _dto: SubmitBidDto): Bid {
    throw new NotImplementedException('submitBid');
  }

  award(_rfpId: string, _bidId: string): RfpDetail {
    throw new NotImplementedException('award');
  }

  cancel(_rfpId: string): RfpDetail {
    throw new NotImplementedException('cancel');
  }

  settle(_dto: CreateSettlementDto): Settlement {
    throw new NotImplementedException('settle');
  }

  getRfp(_rfpId: string): RfpDetail {
    throw new NotImplementedException('getRfp');
  }

  getEvents(_rfpId: string): ReadonlyArray<RfpEvent> {
    throw new NotImplementedException('getEvents');
  }
}
