import { Module } from '@nestjs/common';
import { BiddingModule } from './bidding/bidding.module';

@Module({
  imports: [BiddingModule],
})
export class AppModule {}
