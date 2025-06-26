import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    try {
      const profile = await this.profilesRepository.save(createProfileDto);
      return { status: 'success', data: profile };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll() {
    try {
      const profiles = await this.profilesRepository.find();
      return { status: 'success', data: profiles };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const profile = await this.profilesRepository.findOne({ where: { id } });
      return { status: 'success', data: profile };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findByLabel(label: string) {
    try {
      const profile = await this.profilesRepository.findOne({
        where: { label },
      });
      return { status: 'success', data: profile };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      const profile = await this.profilesRepository.update(
        id,
        updateProfileDto,
      );
      return { status: 'success', data: profile };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const profile = await this.profilesRepository.delete(id);
      return { status: 'success', data: profile };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateProfiles(permits: Permission[]) {
    try {
      const profiles = [];
      const sysPerms = [
        'object_user_view',
        'object_user_delete',
        'object_user_create',
        'object_user_edit',
        'object_profile_view',
        'object_profile_delete',
        'object_profile_create',
        'object_profile_edit',
        'object_project_view_all',
        'object_project_edit_all',
        'object_project_create',
        'object_project_delete',
        'object_role_view',
        'object_role_delete',
        'object_role_create',
        'object_role_edit',
        'object_task_view',
        'object_task_edit',
        'object_task_create',
        'object_task_delete',
        'object_member_view',
        'view_time_tracker',
        'view_projects',
        'view_users',
        'view_profiles',
        'view_roles',
        'view_teams',
      ];
      const standardPerms = [
        'object_project_view',
        'object_task_view',
        'view_time_tracker',
        'view_projects',
      ];
      const leadPerms = [
        'object_team_view',
        'object_team_create',
        'object_team_edit',
        'object_account_view',
        'object_account_create',
        'object_account_edit',
        'object_task_view',
        'object_task_edit',
        'object_task_create',
        'object_project_view',
        'object_profile_create',
        'object_profile_edit',
        'object_project_edit_members',
        'object_member_view',
        'view_time_tracker',
        'view_projects',
        'view_teams',
      ];
      const sysAdmin = new Profile();
      const lead = new Profile();
      const standard = new Profile();
      sysAdmin.label = 'Sys Admin';
      sysAdmin.permissions = [];
      lead.label = 'Lead';
      lead.permissions = [];
      standard.label = 'Standard';
      standard.permissions = [];
      permits.forEach((permit) => {
        if (sysPerms.includes(permit.label)) {
          sysAdmin.permissions.push(permit);
        }
        if (leadPerms.includes(permit.label)) {
          lead.permissions.push(permit);
        }
        if (standardPerms.includes(permit.label)) {
          standard.permissions.push(permit);
        }
      });
      profiles.push(sysAdmin);
      profiles.push(lead);
      profiles.push(standard);
      const data = await this.profilesRepository.save(profiles);
      return { status: 'success', data: data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
