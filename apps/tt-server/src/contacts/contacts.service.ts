import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  create(createContactDto: CreateContactDto) {
    try {
      const contact = this.contactsRepository.save(createContactDto);
      return { status: 'success', data: contact };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findAll() {
    try {
      const contacts = this.contactsRepository.find();
      return { status: 'success', data: contacts };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findOne(id: number) {
    try {
      const contact = this.contactsRepository.findOne({ where: { id } });
      return { status: 'success', data: contact };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const contact = this.contactsRepository.update(id, updateContactDto);
      return { status: 'success', data: contact };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const contact = this.contactsRepository.delete(id);
      return { status: 'success', data: contact };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
