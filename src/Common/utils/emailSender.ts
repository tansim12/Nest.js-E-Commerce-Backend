import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const emailSender = async (
  to: string,
  html: string,
  configService: ConfigService,
  //todo send config service inside emailSender
) => {
  // Retrieve email configuration values from ConfigService
  const email = configService.get<string>('emailSender.email');
  const appPass = configService.get<string>('emailSender.app_pass');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: configService.get<string>('NODE_ENV') === 'production', // Enable secure connection in production
    auth: {
      user: email,
      pass: appPass,
    },
  });

  await transporter.sendMail({
    from: email, // Sender address
    to, // List of receivers
    subject: 'E-Commerce forget password within 5 mins!', // Subject line
    text: 'Forget Password', // Plain text body
    html, // HTML body
  });
};
