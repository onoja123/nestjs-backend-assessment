import { HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import AppError from 'src/utils/appError';

@Injectable()
export class EmailService {
  async sendEmail(
    recipientEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: subject,
      html: body,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new AppError('Failed to send email', HttpStatus.BAD_REQUEST);
    }
  }
}
