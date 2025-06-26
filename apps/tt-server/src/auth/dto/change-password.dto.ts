export class ChangePasswordDto {
  email: string;
  pass?: string;
  new_password?: string;
  recovery_token?: string;
}
