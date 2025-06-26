import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto | CreateMemberDto[]) {
    try {
      const member = await this.membersRepository.save(
        Array.isArray(createMemberDto) ? createMemberDto : [createMemberDto],
      );
      return { status: 'success', data: member };
    } catch (error) {
      console.log(error);
      return { status: 'error', message: error.message };
    }
  }

  findAll() {
    return `This action returns all members`;
  }

  async findByUser(id: number) {
    try {
      const members = await this.membersRepository.find({
        where: { user_id: id },
      });
      return { status: 'success', data: members };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
