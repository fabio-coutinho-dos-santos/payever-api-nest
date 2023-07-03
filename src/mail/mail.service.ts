import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class MailService {

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        service :  process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
  }

  async sendEmail(user: User) {
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_ADDRESS, // sender address
        to : user.email,
        subject: `User ${user.id} created`,
        text: `User ${user.first_name} ${user.last_name} created successfuly!`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}