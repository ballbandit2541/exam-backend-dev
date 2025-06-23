import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async addToQueue(createEmailDto: CreateEmailDto) {
    this.logger.debug(`Adding email to queue: ${JSON.stringify(createEmailDto)}`);
    
    const job = await this.emailQueue.add('send', createEmailDto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        age: 3600, // เก็บไว้ 1 ชั่วโมง
      },
      removeOnFail: false,
    });
    
    return {
      jobId: job.id,
      status: 'added to queue',
    };
  }

  async getJobStatus(jobId: string) {
    const job = await this.emailQueue.getJob(jobId);
    
    if (!job) {
      return { status: 'not found' };
    }
    
    const state = await job.getState();
    const progress = await job.progress();
    const result = job.returnvalue;
    const failReason = job.failedReason;
    
    return {
      id: job.id,
      status: state,
      progress,
      result,
      failReason,
      data: job.data,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  async getJobs(status: 'active' | 'completed' | 'failed' | 'delayed' | 'waiting' = 'active') {
    let jobs;
    
    switch (status) {
      case 'active':
        jobs = await this.emailQueue.getActive();
        break;
      case 'completed':
        jobs = await this.emailQueue.getCompleted();
        break;
      case 'failed':
        jobs = await this.emailQueue.getFailed();
        break;
      case 'delayed':
        jobs = await this.emailQueue.getDelayed();
        break;
      case 'waiting':
        jobs = await this.emailQueue.getWaiting();
        break;
      default:
        jobs = await this.emailQueue.getActive();
    }
    
    return jobs.map(job => ({
      id: job.id,
      status,
      data: job.data,
      timestamp: job.timestamp,
    }));
  }
}
