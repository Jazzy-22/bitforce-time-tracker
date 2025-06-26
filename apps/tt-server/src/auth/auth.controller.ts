import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: LoginDto) {
    return await this.authService.signIn(body);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('activate/:token/:email')
  async activateUser(
    @Param('token') token: string,
    @Param('email') email: string,
  ) {
    return await this.authService.activate(token, email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify/:token/:email')
  async verifyUser(
    @Param('token') token: string,
    @Param('email') email: string,
  ) {
    return await this.authService.activate(token, email);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('change')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(changePasswordDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('forgot/:email')
  async forgotPassword(@Param('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('baseline/data/generation')
  async init() {
    return await this.authService.init();
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify')
  async verify(@User() user: any) {
    if (user.permissions.length == 0) {
      return { status: 'error', message: 'User has no permissions' };
    }
    const u = {
      update: user.update ? true : false,
    };
    return { status: 'success', data: u };
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@User() user: any) {
    return await this.authService.refreshToken(user.email);
  }
}
