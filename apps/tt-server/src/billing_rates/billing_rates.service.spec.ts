import { Test, TestingModule } from '@nestjs/testing';
import { BillingRatesService } from './billing_rates.service';

describe('BillingRatesService', () => {
  let service: BillingRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingRatesService],
    }).compile();

    service = module.get<BillingRatesService>(BillingRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
