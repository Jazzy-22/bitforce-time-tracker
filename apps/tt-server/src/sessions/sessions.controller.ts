import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { MembersService } from 'src/members/members.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { Access } from 'src/auth/decorators/access.decorator';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly membersService: MembersService,
  ) {}

  @Post()
  @Access(['object_session_create'])
  async create(@Body() createSessionDto: CreateSessionDto, @User() user: any) {
    if (!createSessionDto.member_id) {
      if (user.permissions.includes('object_project_edit_all')) {
        try {
          const member = await this.membersService.create({
            project_id: createSessionDto.project_id,
            user_id: user.id,
            role_id: Math.max(user.role_id, 2),
          });
          createSessionDto.member_id = Number(member.data[0].id);
        } catch (error) {
          return { status: 'error', message: error.message };
        }
      }
    }
    createSessionDto.user_id = user.id;
    createSessionDto.status_id = 9;
    delete createSessionDto.project_id;
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @Access(['view_time_tracker'])
  findAll(@User() user: any) {
    return this.sessionsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }

  @Patch(':id')
  @Access(['object_session_create'])
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
