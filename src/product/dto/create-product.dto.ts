import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsOptional()
  productDesc?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  productPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  productStock?: number = 0;
}
