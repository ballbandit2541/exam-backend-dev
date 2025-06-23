import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDynamicLogDto } from './dto/create-dynamic-log.dto';
import { UpdateDynamicLogDto } from './dto/update-dynamic-log.dto';
import { DynamicLog } from './entities/dynamic-log.entity';

@Injectable()
export class DynamicLogService {
  constructor(
    @InjectRepository(DynamicLog, 'log')
    private dynamicLogRepository: Repository<DynamicLog>,
  ) {}

  async create(createDynamicLogDto: CreateDynamicLogDto): Promise<DynamicLog> {
    const log = this.dynamicLogRepository.create(createDynamicLogDto);
    return await this.dynamicLogRepository.save(log);
  }

  async findAll(): Promise<DynamicLog[]> {
    return await this.dynamicLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<DynamicLog> {
    const log = await this.dynamicLogRepository.findOneBy({ id });
    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
    return log;
  }

  async update(id: number, updateDynamicLogDto: UpdateDynamicLogDto): Promise<DynamicLog> {

    const log = await this.findOne(id);
    Object.assign(log, updateDynamicLogDto);
    const updatedLog = await this.dynamicLogRepository.save(log);
    return updatedLog;
  }

  async remove(id: number): Promise<{ message: string }> {
    const log = await this.findOne(id);
    await this.dynamicLogRepository.remove(log);
    
    return { message: `Log ID ${id} removed successfully` };
  }
}
