import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
