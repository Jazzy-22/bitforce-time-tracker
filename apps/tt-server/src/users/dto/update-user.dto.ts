import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id?: number;
  profile_id?: number;
  role_id?: number;
  reports_to?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  landline?: number;
  mobile?: number;
  active?: boolean;
  last_login?: Date;
  img_url?: string;
  failed_attempts?: number;
  blocked?: boolean;
  password_last_changed?: Date;
  pw_reset_date?: Date;
  recovery_token?: string;
}
