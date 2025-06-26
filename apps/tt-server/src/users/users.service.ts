import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Role } from 'src/roles/entities/role.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.save(createUserDto);
      return { status: 'success', data: user };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();
      return { status: 'success', data: users };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['members'],
      });
      if (!user) {
        return { status: 'error', message: 'User not found' };
      }
      return { status: 'success', data: user };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: [
          'profile',
          'profile.permissions',
          'role',
          'role.permissions',
        ],
      });
      if (!user) {
        return { status: 'error', message: 'User not found' };
      }
      return { status: 'success', data: user };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new ConflictException({ message: 'User not found' });
    }
    const updated = await this.usersRepository.save(updateUserDto);
    if (updated) {
      return updated;
    } else {
      return false;
    }
  }

  async failedAttempt(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new ConflictException({ message: 'User not found' });
    }
    user.failed_attempts += 1;
    if (user.failed_attempts >= 5) {
      user.blocked = true;
    }
    await this.usersRepository.update(id, user);
  }

  async successfulAttempt(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new ConflictException({ message: 'User not found' });
    }
    user.failed_attempts = 0;
    user.blocked = false;
    user.last_login = new Date();
    await this.usersRepository.update(id, user);
  }

  async remove(id: number) {
    try {
      const user = await this.usersRepository.delete(id);
      return { status: 'success', data: user };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async autoGenerateUsers(profiles: Profile[], roles: Role[]) {
    try {
      const users = [];
      const first_names = [
        'John',
        'Jane',
        'Michael',
        'Michelle',
        'David',
        'Diana',
        'Chris',
        'Christine',
        'Mark',
        'Mary',
      ];
      const last_names = [
        'Smith',
        'Johnson',
        'Williams',
        'Jones',
        'Brown',
        'Davis',
        'Miller',
        'Wilson',
        'Moore',
        'Taylor',
      ];
      for (let i = 0; i < 10; i++) {
        const y = Math.floor(Math.random() * first_names.length);
        const z = Math.floor(Math.random() * last_names.length);
        const user = new User();
        user.first_name = first_names.splice(y, 1)[0];
        user.last_name = last_names.splice(z, 1)[0];
        user.email = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`;
        user.password = await bcryptjs.hash('password', 10);
        user.profile_id =
          profiles[Math.floor(Math.random() * profiles.length)].id;
        user.role_id = roles[Math.floor(Math.random() * roles.length)].id;
        user.active = true;
        user.blocked = false;
        user.password_last_changed = new Date();
        users.push(user);
      }
      const res = await this.usersRepository.save(users);
      if (res) {
        return { status: 'success', data: res };
      } else {
        return { status: 'error', message: 'Failed to create users' };
      }
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
