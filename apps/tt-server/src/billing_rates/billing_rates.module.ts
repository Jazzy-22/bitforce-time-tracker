import { Module } from '@nestjs/common';
import { BillingRate } from './entities/billing_rate.entity';
import { BillingRatesService } from './billing_rates.service';
import { BillingRatesController } from './billing_rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BillingRate])],
  controllers: [BillingRatesController],
  providers: [BillingRatesService],
  exports: [BillingRatesService],
})
export class BillingRatesModule {}
