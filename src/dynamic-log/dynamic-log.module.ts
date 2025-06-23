import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicLogService } from './dynamic-log.service';
import { DynamicLogController } from './dynamic-log.controller';
import { DynamicLog } from './entities/dynamic-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DynamicLog], 'log')
  ],
  controllers: [DynamicLogController],
  providers: [DynamicLogService],
  exports: [DynamicLogService]
})
export class DynamicLogModule {}
