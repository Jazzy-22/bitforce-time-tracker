import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export default class EmailTemplates {
  signup(user: User) {
    return {
      subject: 'Welcome to TimeTrack!',
      html: `
    <h1>TimeTrack by BitForce</h1>
    <p>Hi ${user.first_name},</p>
    <p>Thank you for signing up. Please click the link below to activate your account:</p>
    <a href="http://localhost:3000/auth/activate/${user.recovery_token}?id=${user.email}">Activate Account</a>
    `,
      text: `Hi ${user.first_name},\nThank you for signing up. Please click the link below to activate your account:\nhttp://localhost:3000/auth/activate/${user.recovery_token}`,
    };
  }

  forgot(user: User) {
    return {
      subject: 'A password reset has been requested',
      html: `
        <h1>TimeTrack by BitForce</h1>
        <p>Hi ${user.first_name},</p>
        <p>A password reset has been requested. If you did not send the request, please disregard this email. Otherwise, follow the link below:</p>
        <a href="http://localhost:3000/auth/reset/${user.recovery_token}?id=${user.email}">Reset Password</a>
        `,
      text: `Hi ${user.first_name},\nA password reset has been requested. If you did not send the request, please disregard this email. Otherwise, follow the link below:\nhttp://localhost:3000/auth/reset/${user.recovery_token}?id=${user.email}`,
    };
  }

  update(user: User) {
    return {
      subject: 'Your password has been changed',
      html: `
            <h1>TimeTrack by BitForce</h1>
            <p>Hi ${user.first_name},</p>
            <p>Your password has been changed. If this was your doing, please disregard this email.</p>
            `,
      text: `Hi ${user.first_name},\nYour password has been changed. If this was your doing, please disregard this email.`,
    };
  }
}
