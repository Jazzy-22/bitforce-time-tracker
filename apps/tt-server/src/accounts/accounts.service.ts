import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private statusService: StatusService,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account = await this.accountsRepository.save(createAccountDto);
      return { status: 'success', data: account };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll(entity: string) {
    try {
      const accounts = await this.accountsRepository.find();
      if (entity) {
        try {
          const status = await this.statusService.findByEntity(entity);
          return {
            status: 'success',
            data: { accounts: accounts, status: status.data },
          };
        } catch (error) {
          return { status: 'error', message: error.message };
        }
      }
      return { status: 'success', data: accounts };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const account = await this.accountsRepository.findOne({ where: { id } });
      return { status: 'success', data: account };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      const account = await this.accountsRepository.update(
        id,
        updateAccountDto,
      );
      return { status: 'success', data: account };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accountsRepository.delete(id);
      return { status: 'success', data: account };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateAccounts(ids: number[]) {
    const names = [
      'Acme Corp',
      'Globex Corp',
      'Initech',
      'Umbrella Corp',
      'Wayne Enterprises',
      'Wonka Industries',
      'Cyberdyne Systems',
      'Gringotts Bank',
      'Oceanic Airlines',
      'Stark Industries',
      'Tyrell Corp',
      'Weyland-Yutani',
      'Virtucon',
      'Soylent Corp',
      'Duff Beer',
      'Bluth Company',
      'Monarch Solutions',
      'Rich Industries',
      'Spacely Space Sprockets',
      'Vandelay Industries',
      'Strickland Propane',
      'Thatherton Fuels',
    ];

    try {
      const accounts = [];
      for (const id of ids) {
        for (
          let i = 0;
          i < Math.min(Math.floor(Math.random() * 4) + 1, names.length);
          i++
        ) {
          const account = new Account();
          account.name = names.splice(
            Math.floor(Math.random() * names.length),
            1,
          )[0];
          account.owner_id = id;
          accounts.push(account);
        }
      }
      const res = await this.accountsRepository.save(accounts);
      if (res) {
        return { status: 'success', data: res };
      } else {
        return { status: 'error', message: 'Could not create accounts' };
      }
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
