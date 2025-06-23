import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { DynamicLogService } from './dynamic-log.service';
import { CreateDynamicLogDto } from './dto/create-dynamic-log.dto';
import { UpdateDynamicLogDto } from './dto/update-dynamic-log.dto';
import { DynamicLog } from './entities/dynamic-log.entity';

@Controller('dynamic-log')
export class DynamicLogController {
  constructor(private readonly dynamicLogService: DynamicLogService) {}

  @Post()
  async create(@Body() createDynamicLogDto: CreateDynamicLogDto): Promise<DynamicLog> {
    return this.dynamicLogService.create(createDynamicLogDto);
  }

  @Get()
  async findAll(): Promise<DynamicLog[]> {
    return this.dynamicLogService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<DynamicLog> {
    return this.dynamicLogService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDynamicLogDto: UpdateDynamicLogDto,
  ): Promise<DynamicLog> {
    return this.dynamicLogService.update(id, updateDynamicLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.dynamicLogService.remove(id);
  }
}
