import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { CreateRfpDto } from './dto/create-rfp.dto';
import { SubmitBidDto } from './dto/submit-bid.dto';
import { AwardDto } from './dto/award.dto';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { ListRfpsQueryDto } from './dto/list-rfps.query.dto';

/**
 * Thin controller: it parses input (DTOs) and delegates to the service.
 * No business logic here.
 */
@Controller()
export class BiddingController {
  constructor(private readonly bidding: BiddingService) {}

  @Post('rfps')
  createRfp(@Body() dto: CreateRfpDto) {
    return this.bidding.createRfp(dto);
  }

  @Get('rfps')
  listRfps(@Query() query: ListRfpsQueryDto) {
    return this.bidding.listRfps(query);
  }

  @Post('rfps/:id/bids')
  submitBid(@Param('id') rfpId: string, @Body() dto: SubmitBidDto) {
    return this.bidding.submitBid(rfpId, dto);
  }

  @Post('rfps/:id/award')
  @HttpCode(200)
  award(@Param('id') rfpId: string, @Body() dto: AwardDto) {
    return this.bidding.award(rfpId, dto.bidId);
  }

  @Post('rfps/:id/cancel')
  @HttpCode(200)
  cancel(@Param('id') rfpId: string) {
    return this.bidding.cancel(rfpId);
  }

  @Post('settlements')
  settle(@Body() dto: CreateSettlementDto) {
    return this.bidding.settle(dto);
  }

  @Get('rfps/:id')
  getRfp(@Param('id') rfpId: string) {
    return this.bidding.getRfp(rfpId);
  }

  @Get('rfps/:id/events')
  getEvents(@Param('id') rfpId: string) {
    return this.bidding.getEvents(rfpId);
  }
}
