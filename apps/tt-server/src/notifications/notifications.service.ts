import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = this.notificationsRepository.save(
        createNotificationDto,
      );
      return { status: 'success', data: notification };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findAll() {
    try {
      const notifications = this.notificationsRepository.find();
      return { status: 'success', data: notifications };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  findOne(id: number) {
    try {
      const notification = this.notificationsRepository.findOne({
        where: { id },
      });
      return { status: 'success', data: notification };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      const updated = this.notificationsRepository.update(
        id,
        updateNotificationDto,
      );
      return { status: 'success', data: updated };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  remove(id: number) {
    try {
      const deleted = this.notificationsRepository.delete(id);
      return { status: 'success', data: deleted };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
