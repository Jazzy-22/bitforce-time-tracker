import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Member } from 'src/members/entities/member.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Task } from './entities/task.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Repository, DataSource, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.tasksRepository.save(createTaskDto);
      return { status: 'success', data: task };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll(user: any) {
    try {
      const tasks = await this.tasksRepository.find();
      return { status: 'success', data: tasks };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAllByProject(projectId: number, user: any) {
    const userRole = new Role();
    userRole.id = user.role_id;
    const roles = await this.dataSource
      .getTreeRepository(Role)
      .findDescendants(userRole)
      .then((roles) => roles.map((role) => role.id));
    try {
      const tasks = await this.tasksRepository.find({
        relations: ['project', 'status', 'members', 'members.user', 'role'],
        where: {
          project: { id: projectId },
          role: { id: In(roles) },
        },
        select: {
          id: true,
          title: true,
          status: { id: true, label: true },
          members: { id: true, user: { first_name: true, last_name: true } },
          role: { id: true, label: true },
        },
      });
      return { status: 'success', data: tasks };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.tasksRepository.find({
        relations: ['project', 'project.members', 'status', 'members', 'role'],
        where: { id },
      });
      return { status: 'success', data: task };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    updateTaskDto.id = id;
    if (updateTaskDto.members) {
      const original = (await this.findOne(id)).data;
      const ms = [];
      original[0].members.forEach((m: Member) => {
        ms.push(m);
      });
      updateTaskDto.members = updateTaskDto.members.forEach((m: Member) => {
        const member = new Member();
        member.id = m.id;
        ms.push(member);
      });
      updateTaskDto.members = ms;
    }
    try {
      const task = await this.tasksRepository.save(updateTaskDto);
      return { status: 'success', data: task };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const task = await this.tasksRepository.delete(id);
      return { status: 'success', data: task };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateTasks(projects: Project[], status: number) {
    const titles = [
      'Bug Fix',
      'Feature Implementation',
      'Code Review',
      'Testing',
      'Documentation',
      'Deployment',
      'Refactoring',
      'Database Management',
      'UI/UX Design',
      'Security Audit',
      'Performance Optimization',
      'Technical Debt',
      'Training',
      'Research',
    ];
    const tasks = [];
    projects.forEach((project) => {
      for (let i = 0; i < Math.floor(Math.random() * 8 + 1); i++) {
        const task = new Task();
        task.title = `${project.key}-${Math.floor(Math.random() * 99 + 1)}: ${titles[Math.floor(Math.random() * titles.length)]}`;
        task.project_id = project.id;
        task.status_id = status;
        task.role_id = Math.floor(Math.random() * 2 + 3);
        tasks.push(task);
      }
    });
    try {
      const task = await this.tasksRepository.save(tasks);
      return { status: 'success', data: task };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
