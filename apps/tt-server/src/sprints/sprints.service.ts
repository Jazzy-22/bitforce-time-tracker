import { Injectable } from '@nestjs/common';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private sprintsRepository: Repository<Sprint>,
  ) {}

  create(createSprintDto: CreateSprintDto) {
    try {
      const sprint = this.sprintsRepository.save(createSprintDto);
      return { status: 'success', data: sprint };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findAll() {
    try {
      const sprints = this.sprintsRepository.find();
      return { status: 'success', data: sprints };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findOne(id: number) {
    try {
      const sprint = this.sprintsRepository.findOne({ where: { id } });
      return { status: 'success', data: sprint };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    try {
      const sprint = this.sprintsRepository.update(id, updateSprintDto);
      return { status: 'success', data: sprint };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const sprint = this.sprintsRepository.delete(id);
      return { status: 'success', data: sprint };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
