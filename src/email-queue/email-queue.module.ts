import { Module, DynamicModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailQueueService } from './email-queue.service';
import { EmailQueueController } from './email-queue.controller';
import { EmailProcessor } from './processors/email.processor';
import { EmailDirectService } from './email-direct.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [EmailQueueController],
  providers: [EmailDirectService],
  exports: [EmailDirectService],
})
export class EmailQueueModule {
  static forRoot(): DynamicModule {
    const useRedis = process.env.USE_REDIS === 'true';
    
    const imports: any[] = [ConfigModule];
    const providers: any[] = [EmailDirectService];
    const exports: any[] = [EmailDirectService];
    
    if (useRedis) {
      imports.push(
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            redis: {
              host: configService.get('REDIS_HOST', 'localhost'),
              port: configService.get('REDIS_PORT', 6379),
              password: configService.get('REDIS_PASSWORD', ''),
              maxRetriesPerRequest: 3,
              retryStrategy: (times: number) => {
                if (times > 3) {
                  console.error('Could not connect to Redis. Giving up...');
                  return null;
                }
                return Math.min(times * 1000, 3000);
              },
              enableReadyCheck: false,
            },
          }),
        }),
        BullModule.registerQueue({
          name: 'email',
        })
      );
      
      providers.push(EmailQueueService, EmailProcessor);
      
      exports.push(EmailQueueService);
    } else {
      console.log('Redis is disabled for email queue');
    }
    
    return {
      module: EmailQueueModule,
      imports,
      providers,
      exports,
    };
  }
}
