import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor() {}

  @Process('send')
  async handleSendEmail(job: Job) {
    this.logger.debug(`Processing email job ${job.id}`);
    this.logger.debug(`Email data: ${JSON.stringify(job.data)}`);
    
    const { to, subject, text, html, from } = job.data;
    
    try {
      // test account 
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      const result = await transporter.sendMail({
        from: from || '"Test Sender" <test@example.com>',
        to,
        subject,
        text,
        html: html || text,
      });
      
      const previewUrl = nodemailer.getTestMessageUrl(result);
      
      this.logger.debug(`Email sent: ${result.messageId}`);
      this.logger.debug(`Preview URL: ${previewUrl}`);
      
      return {
        ...result,
        previewUrl,
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
