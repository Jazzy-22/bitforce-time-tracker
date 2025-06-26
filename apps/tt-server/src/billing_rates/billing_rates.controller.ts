import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillingRatesService } from './billing_rates.service';
import { CreateBillingRateDto } from './dto/create-billing_rate.dto';
import { UpdateBillingRateDto } from './dto/update-billing_rate.dto';

@Controller('billing-rates')
export class BillingRatesController {
  constructor(private readonly billingRatesService: BillingRatesService) {}

  @Post()
  create(@Body() createBillingRateDto: CreateBillingRateDto) {
    return this.billingRatesService.create(createBillingRateDto);
  }

  @Get(':id')
  findByProject(@Param('id') id: string) {
    return this.billingRatesService.findByProject(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBillingRateDto: UpdateBillingRateDto,
  ) {
    return this.billingRatesService.update(+id, updateBillingRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingRatesService.remove(+id);
  }
}
