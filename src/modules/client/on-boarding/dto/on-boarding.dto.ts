import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOnboardingDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform((param) => param.value.toLowerCase())
  email: string;

}

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
