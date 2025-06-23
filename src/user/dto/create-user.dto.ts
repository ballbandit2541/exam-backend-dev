import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength,IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  userPassword: string;

  @IsString()
  userFirstName: string;

  @IsString()
  userLastName: string;

  @IsString()
  @IsOptional()
  userRole?: string = 'user';

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}