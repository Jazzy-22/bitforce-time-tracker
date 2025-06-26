import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/email/email.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProjectsService } from 'src/projects/projects.service';
import { RolesService } from 'src/roles/roles.service';
import { StatusService } from 'src/status/status.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private permissionsService: PermissionsService,
    private profilesService: ProfilesService,
    private rolesService: RolesService,
    private statusService: StatusService,
    private projectsService: ProjectsService,
    private accountsService: AccountsService,
    private tasksService: TasksService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<any> {
    const u = await this.usersService.findOneByEmail(loginDto.email);
    if (u.status === 'error') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = u.data;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.active) {
      throw new ForbiddenException('Inactive user');
    }
    if (user.blocked) {
      throw new ForbiddenException('Blocked user');
    }
    if (!(await bcryptjs.compare(loginDto.password, user.password))) {
      await this.usersService.failedAttempt(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }
    const sixMonthsAgo = new Date();
    if (sixMonthsAgo.getMonth() < 6) {
      sixMonthsAgo.setFullYear(sixMonthsAgo.getFullYear() - 1);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() + 6);
    } else {
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    }

    if (user.password_last_changed < sixMonthsAgo) {
      await this.usersService.update(user.id, { id: user.id, blocked: true });
      throw new ForbiddenException('Expired password');
    }
    const payload = this.generatePayload(user);
    const access_token = await this.jwtService.signAsync(payload);
    await this.usersService.successfulAttempt(user.id);
    return {
      access: this.mapPermissions(payload.permissions),
      user: user.id,
      token: access_token,
      update: false,
    };
  }

  async refreshToken(email: string): Promise<any> {
    const u = await this.usersService.findOneByEmail(email);
    if (u.status === 'error') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = u.data;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.active) {
      throw new ForbiddenException('Inactive user');
    }
    if (user.blocked) {
      throw new ForbiddenException('Blocked user');
    }
    const payload = this.generatePayload(user);
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access: this.mapPermissions(payload.permissions),
      user: user.id,
      token: access_token,
      update: false,
    };
  }

  private mapPermissions(permissions: string[]) {
    return permissions.map((p) =>
      p
        .replaceAll('proj', 'j')
        .split('_')
        .map((w) => w.charAt(0).toUpperCase())
        .join(''),
    );
  }

  private generatePayload(user: User) {
    const permissions = user.profile.permissions.map((p) => p.label);
    user.role.permissions.forEach((p) => permissions.push(p.label));
    return {
      email: user.email,
      id: user.id,
      role_id: user.role_id,
      profile_id: user.profile_id,
      first_name: user.first_name,
      last_name: user.last_name,
      permissions: permissions.sort().filter((p, i, a) => a.indexOf(p) === i),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user.status === 'success') {
      throw new ForbiddenException('Existing user');
    }
    if (!createUserDto.role_id) {
      const standardRole = await this.rolesService.findByLabel('Developer');
      if (standardRole.status === 'error') {
        throw new ForbiddenException('Could not find standard role');
      } else {
        createUserDto.role_id = standardRole.data.id;
      }
    }
    if (!createUserDto.profile_id) {
      const standardProfile =
        await this.profilesService.findByLabel('Standard');
      if (standardProfile.status === 'error') {
        throw new ForbiddenException('Could not find standard profile');
      } else {
        createUserDto.profile_id = standardProfile.data.id;
      }
    }
    const newPass = await this.generateRandomPassword();
    createUserDto.password = newPass.hashed;
    createUserDto.active = false;
    createUserDto.blocked = true;
    createUserDto.pw_reset_date = new Date();
    createUserDto.recovery_token = await this.generateRecoveryToken();
    const newUser = await this.usersService.create(createUserDto);
    if (newUser.status === 'success') {
      return await this.emailService.credentials(newUser.data, 'signup');
    } else {
      throw new ForbiddenException('User could not be created');
    }
  }

  async activate(token: string, email: string): Promise<any> {
    const u = await this.usersService.findOneByEmail(email);
    if (u.status === 'error') {
      throw new UnauthorizedException('The email is not registered');
    }
    const user = u.data;
    if ((token && user.recovery_token !== token) || !token) {
      throw new ForbiddenException('Your token is invalid');
    }
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    if (user.pw_reset_date && user.pw_reset_date < oneDayAgo) {
      throw new ForbiddenException('Your token has expired');
    } else {
      const recovery = await this.generateRecoveryToken();
      await this.usersService.update(user.id, {
        id: user.id,
        recovery_token: recovery,
        pw_reset_date: new Date(),
      });
      const updated = await this.usersService.update(user.id, {
        id: user.id,
        active: true,
      });
      if (updated) {
        return { status: 'ok', recovery_token: recovery };
      } else {
        throw new ForbiddenException('Something went wrong. Try again later');
      }
    }
  }

  async changePassword(data: ChangePasswordDto): Promise<any> {
    const u = await this.usersService.findOneByEmail(data.email);
    if (u.status === 'error') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = u.data;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (
      (data.pass && !(await bcryptjs.compare(data.pass, user.password))) ||
      (data.recovery_token && !(data.recovery_token === user.recovery_token))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    if (user.pw_reset_date && user.pw_reset_date < oneHourAgo) {
      throw new ForbiddenException('Your token has expired');
    }
    const hashedPassword = await bcryptjs.hash(data.new_password, 10);
    const updated = await this.usersService.update(user.id, {
      id: user.id,
      password: hashedPassword,
      password_last_changed: new Date(),
      pw_reset_date: null,
      blocked: false,
      recovery_token: null,
    });
    if (updated) {
      return await this.emailService.credentials(user, 'update');
    } else {
      throw new ForbiddenException('Something went wrong. Try again later');
    }
  }

  async forgotPassword(email: string): Promise<any> {
    const u = await this.usersService.findOneByEmail(email);
    if (u.status === 'error') {
      return { status: 'success', message: 'Email sent' };
    }
    const user = u.data;
    if (!user) {
      return { status: 'success', message: 'Email sent' };
    }
    const recovery = await this.generateRecoveryToken();
    user.recovery_token = recovery;
    user.pw_reset_date = new Date();
    const updated = await this.usersService.update(user.id, user);
    if (updated) {
      return await this.emailService.credentials(updated, 'forgot');
    } else {
      throw new ForbiddenException('Something went wrong. Try again later');
    }
  }

  async init() {
    const permissions = await this.permissionsService.autoGeneratePermissions();
    if (permissions.status === 'error') {
      throw new ForbiddenException('Could not generate permissions');
    }
    const profiles = await this.profilesService.autoGenerateProfiles(
      permissions.data,
    );
    if (profiles.status === 'error') {
      throw new ForbiddenException('Could not generate profiles');
    }
    const roles = await this.rolesService.autoGenerateRoles(permissions.data);
    if (roles.status === 'error') {
      throw new ForbiddenException('Could not generate roles');
    }
    const highRole = await this.rolesService.findHighest();
    const users = await this.usersService.autoGenerateUsers(
      profiles.data,
      roles.data,
    );
    if (users.status === 'error') {
      throw new ForbiddenException('Could not generate users');
    }
    const status = await this.statusService.autoGenerateStatus();
    if (status.status === 'error') {
      throw new ForbiddenException('Could not generate status');
    }
    const owners = users.data
      .filter((u) => u.role_id === highRole)
      .map((u) => u.id);
    const accounts = await this.accountsService.autoGenerateAccounts(owners);
    if (accounts.status === 'error') {
      throw new ForbiddenException('Could not generate accounts');
    }
    const minions = users.data.filter((u) => u.role_id !== highRole);
    const projects = await this.projectsService.autoGenerateProjects(
      accounts.data,
      minions,
      highRole,
    );
    if (projects.status === 'error') {
      throw new ForbiddenException('Could not generate projects');
    }
    const taskStatus = status.data
      .filter((s) => s.entity === 'task')
      .find((s) => s.level === 1).id;
    const tasks = await this.tasksService.autoGenerateTasks(
      projects.data,
      taskStatus,
    );
    if (tasks.status === 'error') {
      throw new ForbiddenException('Could not generate tasks');
    }
    return { status: 'success', message: 'Init complete' };
  }

  async generateRecoveryToken() {
    const rand = Math.random().toString(36).slice(-8);
    const hashedToken = (await bcryptjs.hash(rand, 16)).replace(/[^\w]/gi, '');
    return hashedToken;
  }

  async generateRandomPassword() {
    const newPass = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcryptjs.hash(newPass, 10);
    return { pass: newPass, hashed: hashedPassword };
  }
}
