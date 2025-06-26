import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Access } from 'src/auth/decorators/access.decorator';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Access(['object_task_create'])
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Post('webhook')
  webhook(@Body() webhookDto: any) {
    const webhook = JSON.parse(webhookDto.payload);
    return this.tasksService.create(webhook);
  }

  @Get()
  @Access(['object_task_view'])
  findAll(@User() user: any) {
    return this.tasksService.findAll(user);
  }

  @Get('project/:projectId')
  @Access(['object_task_view'])
  findAllByProject(@Param('projectId') projectId: string, @User() user: any) {
    return this.tasksService.findAllByProject(+projectId, user);
  }

  @Get(':id')
  @Access(['object_task_view'])
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @Access(['object_task_edit'])
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @Access(['object_task_delete'])
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
