import { Permission } from 'src/permissions/entities/permission.entity';

export class CreateRoleDto {
  label: string;
  field: string;
  description?: string;
  parent_id?: number;
  level?: number;
  permits?: number[];
  permissions?: Permission[];
}
