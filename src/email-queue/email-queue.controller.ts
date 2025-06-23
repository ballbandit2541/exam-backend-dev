import { Body, Controller, Get, Param, Post, Query, Optional } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { EmailDirectService } from './email-direct.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email-queue')
export class EmailQueueController {
  constructor(
    @Optional() private readonly emailQueueService: EmailQueueService,
    private readonly emailDirectService: EmailDirectService,
  ) {}

  @Post()
  async addToQueue(@Body() createEmailDto: CreateEmailDto) {
    if (this.emailQueueService) {
      return this.emailQueueService.addToQueue(createEmailDto);
    } else {
      return this.emailDirectService.sendEmail(createEmailDto);
    }
  }

  @Get('status/:id')
  async getJobStatus(@Param('id') id: string) {
    if (this.emailQueueService) {
      return this.emailQueueService.getJobStatus(id);
    } else {
      return { message: 'Queue service is not available. Redis is not configured.' };
    }
  }

  @Get('jobs')
  async getJobs(@Query('status') status: 'active' | 'completed' | 'failed' | 'delayed' | 'waiting' = 'active') {
    if (this.emailQueueService) {
      return this.emailQueueService.getJobs(status);
    } else {
      return { message: 'Queue service is not available. Redis is not configured.' };
    }
  }

  @Post('direct')
  async sendEmailDirect(@Body() createEmailDto: CreateEmailDto) {
    return this.emailDirectService.sendEmail(createEmailDto);
  }
}
