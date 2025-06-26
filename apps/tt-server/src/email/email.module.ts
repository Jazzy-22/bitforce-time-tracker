import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import EmailTemplates from './templates/temaplates';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          secure: true,
          auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `TimeTrack by BitForce <${configService.get('EMAIL_USERNAME')}>`,
          sender: configService.get('EMAIL_USERNAME'),
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailTemplates],
  exports: [EmailService],
})
export class EmailModule {}
