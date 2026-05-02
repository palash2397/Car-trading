import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMechanicProfileDto {

  @ApiProperty({
    example: 'Star Auto Inspection',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  garageName?: string;

  @ApiProperty({
    example: '45 Industrial Area Road',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    example: 'Khobar',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({
    example: 'Eastern Province',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({
    example: '31952',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @ApiProperty({
    example: 'Car Inspection',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serviceType?: string;

  @ApiPropertyOptional({
    example: 'Professional used car inspection and condition reports.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}