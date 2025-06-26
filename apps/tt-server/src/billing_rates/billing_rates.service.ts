import { Injectable } from '@nestjs/common';
import { CreateBillingRateDto } from './dto/create-billing_rate.dto';
import { UpdateBillingRateDto } from './dto/update-billing_rate.dto';
import { BillingRate } from './entities/billing_rate.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BillingRatesService {
  constructor(
    @InjectRepository(BillingRate)
    private billingRatesRepository: Repository<BillingRate>,
  ) {}

  create(createBillingRateDto: CreateBillingRateDto) {
    try {
      const billingRate =
        this.billingRatesRepository.save(createBillingRateDto);
      return { status: 'success', data: billingRate };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findByProject(id: number) {
    try {
      const billingRates = this.billingRatesRepository.find({
        where: { project_id: id },
      });
      return { status: 'success', data: billingRates };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateBillingRateDto: UpdateBillingRateDto) {
    try {
      const billingRate = this.billingRatesRepository.update(
        id,
        updateBillingRateDto,
      );
      return { status: 'success', data: billingRate };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const billingRate = this.billingRatesRepository.delete(id);
      return { status: 'success', data: billingRate };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
