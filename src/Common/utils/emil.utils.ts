import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtils {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS ব্যবহার করা হবে
      auth: {
        user: process.env.EMAIL, // আপনার ইমেইল
        pass: process.env.APP_PASS, // অ্যাপ পাসওয়ার্ড
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Password Reset" <${process.env.EMAIL}>`, // প্রেরকের ঠিকানা
      to, // প্রাপকের ইমেইল
      subject, // ইমেইল সাবজেক্ট
      html, // HTML ফর্ম্যাট
    });
  }

  async sendManyEmails(
    emailArray: string[], // ইমেইলের লিস্ট
    subject: string,
    html: string,
  ): Promise<void> {
    // Promise.all ব্যবহার করে একসাথে সব ইমেইল পাঠানো
    await Promise.all(
      emailArray.map((email) =>
        this.transporter.sendMail({
          from: `"Group Email Service" <${process.env.EMAIL}>`,
          to: email,
          subject,
          html,
        }),
      ),
    );
  }
}
