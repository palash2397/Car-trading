import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/common/enums/user/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role provided' })
  roles: Role[] = [Role.USER] ;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
