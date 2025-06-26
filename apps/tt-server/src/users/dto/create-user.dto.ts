export class CreateUserDto {
  profile_id: number;
  role_id: number;
  reports_to?: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  landline?: number;
  mobile?: number;
  active?: boolean;
  blocked?: boolean;
  pw_reset_date?: Date;
  recovery_token?: string;
  created_at?: Date;
}
