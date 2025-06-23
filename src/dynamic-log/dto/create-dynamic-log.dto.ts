import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDynamicLogDto {
  @IsString()
  action: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
