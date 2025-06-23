import { Injectable, Logger } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailDirectService {
  private readonly logger = new Logger(EmailDirectService.name);

  async sendEmail(createEmailDto: CreateEmailDto) {
    this.logger.debug(`Sending email directly: ${JSON.stringify(createEmailDto)}`);
    
    const { to, subject, text, html, from } = createEmailDto;
    
    try {
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
        messageId: result.messageId,
        previewUrl,
        status: 'sent',
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
