import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/entities/permission.entity';

//when creating a new Role, the parent role must be set as the whole Role object,
//not just the id of the parent role.
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.rolesRepository.save(createRoleDto);
      return { status: 'success', data: role };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll() {
    try {
      const roles = await this.rolesRepository.find({
        relations: ['parent', 'children'],
      });
      return { status: 'success', data: roles };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findHighest() {
    try {
      const roles = await this.rolesRepository.find({
        select: ['id'],
        order: { level: 'ASC' },
        take: 1,
      });
      return roles[0].id;
    } catch (error) {
      return null;
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.rolesRepository.findOne({ where: { id } });
      return { status: 'success', data: role };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findByLabel(label: string) {
    try {
      const role = await this.rolesRepository.findOne({ where: { label } });
      return { status: 'success', data: role };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const allPermissions = (await this.permissionsService.findAll()).data;
      const permissions: Permission[] = [];
      for (const permission of updateRoleDto.permits) {
        const p = allPermissions.find((p) => p.id === permission);
        permissions.push(p);
      }
      delete updateRoleDto.permits;
      updateRoleDto.permissions = permissions;
      updateRoleDto.id = id;
      const role = await this.rolesRepository.save(updateRoleDto);
      return { status: 'success', data: role };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const role = await this.rolesRepository.delete(id);
      return { status: 'success', data: role };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateRoles(permits: Permission[]) {
    const ownerPerms = [
      'view_roles',
      'object_role_view',
      'object_role_create',
      'view_teams',
      'object_team_view',
      'object_team_delete',
      'object_team_create',
      'object_team_edit',
      'object_account_view',
      'object_account_create',
      'object_account_edit',
      'object_task_view',
      'object_task_create',
      'object_task_edit',
      'object_task_delete',
      'object_session_create',
      'object_project_view',
      'object_project_create',
      'object_project_edit',
      'object_project_delete',
      'object_project_edit_members',
      'object_member_view',
    ];
    const leadPerms = [
      'view_roles',
      'object_role_view',
      'view_teams',
      'object_team_view',
      'object_team_delete',
      'object_team_create',
      'object_team_edit',
      'object_account_view',
      'object_account_create',
      'object_account_edit',
      'object_task_view',
      'object_task_create',
      'object_task_edit',
      'object_session_create',
      'object_project_view',
      'object_project_edit_members',
      'object_member_view',
    ];
    const devPerms = [
      'object_task_view',
      'object_task_create',
      'object_task_edit',
      'object_session_create',
      'object_project_view',
      'object_member_view',
    ];
    try {
      const po = new Role();
      po.label = 'Project Owner';
      po.level = 0;
      po.permissions = permits.filter((p) => ownerPerms.includes(p.label));
      const projectOwner = await this.rolesRepository.save(po);
      if (projectOwner) {
        const l = new Role();
        l.label = 'Lead';
        l.level = 1;
        l.parent = projectOwner;
        l.permissions = permits.filter((p) => leadPerms.includes(p.label));
        const lead = await this.rolesRepository.save(l);
        if (lead) {
          const dev = new Role();
          dev.label = 'Developer';
          dev.level = 2;
          dev.parent = lead;
          dev.permissions = permits.filter((p) => devPerms.includes(p.label));
          const developer = await this.rolesRepository.save(dev);
          if (developer) {
            const tester = new Role();
            tester.label = 'QA';
            tester.level = 2;
            tester.parent = lead;
            tester.permissions = permits.filter((p) =>
              devPerms.includes(p.label),
            );
            const testerRole = await this.rolesRepository.save(tester);
            if (testerRole) {
              return {
                status: 'success',
                data: [projectOwner, lead, developer, testerRole],
              };
            }
          }
        }
      } else {
        return { status: 'error', message: 'Error creating roles' };
      }
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
