import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    try {
      const group = this.groupsRepository.save(createGroupDto);
      return { status: 'success', data: group };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findAll() {
    try {
      const groups = this.groupsRepository.find();
      return { status: 'success', data: groups };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findOne(id: number) {
    try {
      const group = this.groupsRepository.findOne({ where: { id } });
      return { status: 'success', data: group };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      const group = this.groupsRepository.update(id, updateGroupDto);
      return { status: 'success', data: group };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const group = this.groupsRepository.delete(id);
      return { status: 'success', data: group };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
