import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicLogDto } from './create-dynamic-log.dto';

export class UpdateDynamicLogDto extends PartialType(CreateDynamicLogDto) {}
