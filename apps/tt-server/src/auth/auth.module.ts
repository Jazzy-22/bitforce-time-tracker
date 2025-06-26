import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { RolesModule } from 'src/roles/roles.module';
import { StatusModule } from 'src/status/status.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { PermissionsInitModule } from 'src/permissions-init/permissions-init.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    EmailModule,
    PermissionsModule,
    ProfilesModule,
    RolesModule,
    StatusModule,
    ProjectsModule,
    AccountsModule,
    TasksModule,
    PermissionsInitModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
