import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionType } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const permission =
        await this.permissionsRepository.save(createPermissionDto);
      return { status: 'success', data: permission };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll() {
    try {
      const permissions = await this.permissionsRepository.find();
      return { status: 'success', data: permissions };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { id },
      });
      return { status: 'success', data: permission };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const updated = await this.permissionsRepository.update(
        id,
        updatePermissionDto,
      );
      return { status: 'success', data: updated };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.permissionsRepository.delete(id);
      return { status: 'success', data: deleted };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGeneratePermissions() {
    try {
      const permissions = Object.values(PermissionType).map((label) => {
        return { label };
      });
      const data = await this.permissionsRepository.save(permissions);
      return { status: 'success', data: data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
