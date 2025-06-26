import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import EmailTemplates from './templates/temaplates';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    readonly templates: EmailTemplates,
  ) {}

  async credentials(user: User, type: string) {
    if (
      user.email.substring(user.email.lastIndexOf('@') + 1) == 'example.com'
    ) {
      return { status: 'success', message: 'Fake email' };
    }
    let mail = null;
    switch (type) {
      case 'signup':
        mail = this.templates.signup(user);
        break;
      case 'forgot':
        mail = this.templates.forgot(user);
        break;
      case 'update':
        mail = this.templates.update(user);
        break;
      default:
        return { status: 'error', message: 'Invalid type' };
    }
    const res = await this.mailerService.sendMail({
      to: user.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (res.accepted.length > 0) {
      return { status: 'success', message: 'Email sent' };
    }
    return { status: 'error', message: 'an unknown error has occured' };
  }
}
