import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { Access } from 'src/auth/decorators/access.decorator';

@Controller('projects')
@Access([
  'object_project_view',
  'object_project_view_all',
  'object_project_create',
  'object_project_edit',
  'object_project_edit_all',
  'object_project_delete',
  'object_project_edit_members',
])
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Access(['object_project_create'])
  create(@Body() createProjectDto: CreateProjectDto, @User() user: any) {
    createProjectDto.owner_id = user.id;
    return this.projectsService.create(createProjectDto);
  }

  @Post('webhook')
  webhook(@Body() webhookDto: any) {
    const webhook = JSON.parse(webhookDto.payload);
    return this.projectsService.create(webhook);
  }

  @Get()
  @Access(['object_project_view', 'object_project_view_all'])
  findAll(@User() user: any) {
    return this.projectsService.findAll(user);
  }

  @Get(':key')
  @Access(['object_project_view', 'object_project_view_all'])
  findOne(@Param('key') key: string, @User() user: any) {
    return this.projectsService.findOne(key, user);
  }

  @Patch(':id')
  @Access(['object_project_edit', 'object_project_edit_all'])
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @Access(['object_project_delete'])
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
