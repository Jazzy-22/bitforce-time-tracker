import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto) {
    try {
      const status = await this.statusRepository.save(createStatusDto);
      return { status: 'success', data: status };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findByEntity(entity: string) {
    try {
      const statuses = await this.statusRepository.find({ where: { entity } });
      return { status: 'success', data: statuses };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    try {
      const status = await this.statusRepository.update(id, updateStatusDto);
      return { status: 'success', data: status };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const status = await this.statusRepository.delete(id);
      return { status: 'success', data: status };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateStatus() {
    try {
      const statuses = [];
      const entities = ['task', 'project', 'session', 'sprint'];
      const labels = ['To Do', 'In Progress', 'Done'];
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const levels = [1, 2, 3];
      entities.forEach((entity) => {
        labels.forEach((label, index) => {
          statuses.push({
            entity,
            label,
            color: colors[index],
            level: levels[index],
          });
        });
      });
      await this.statusRepository.save(statuses);
      return { status: 'success', data: statuses };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
