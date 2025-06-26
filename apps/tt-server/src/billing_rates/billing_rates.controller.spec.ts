import { Test, TestingModule } from '@nestjs/testing';
import { BillingRatesController } from './billing_rates.controller';
import { BillingRatesService } from './billing_rates.service';

describe('BillingRatesController', () => {
  let controller: BillingRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingRatesController],
      providers: [BillingRatesService],
    }).compile();

    controller = module.get<BillingRatesController>(BillingRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
