import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingRateDto } from './create-billing_rate.dto';

export class UpdateBillingRateDto extends PartialType(CreateBillingRateDto) {}
