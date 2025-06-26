import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    private tasksService: TasksService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    try {
      const session = await this.sessionsRepository.save(createSessionDto);
      if (!session) {
        return { status: 'error', message: 'Session not created' };
      }
      try {
        const t = new UpdateTaskDto();
        t.members = [{ id: createSessionDto.member_id }];
        await this.tasksService.update(createSessionDto.task_id, t);
      } catch (error) {
        return { status: 'error', message: error.message };
      }
      return { status: 'success', data: session };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll(id: number) {
    try {
      const sessions = await this.sessionsRepository.find({
        where: { user_id: id },
        relations: ['task', 'task.project', 'task.project.account', 'status'],
        select: {
          id: true,
          user_id: true,
          member_id: true,
          start_date: true,
          end_date: true,
          billable: true,
          task: {
            id: true,
            title: true,
            status_id: true,
            project: {
              id: true,
              name: true,
              account: {
                id: true,
                name: true,
              },
            },
          },
          status: {
            id: true,
            label: true,
          },
        },
      });
      return { status: 'success', data: sessions };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findOne(id: number) {
    try {
      const session = this.sessionsRepository.findOne({ where: { id } });
      return { status: 'success', data: session };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    try {
      const session = await this.sessionsRepository.update(
        id,
        updateSessionDto,
      );
      return { status: 'success', data: session };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const session = this.sessionsRepository.delete(id);
      return { status: 'success', data: session };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
