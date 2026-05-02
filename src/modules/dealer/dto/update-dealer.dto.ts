import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDealerDto {
  @ApiPropertyOptional()
  @ApiProperty({
    example: 'Prime Auto Motors',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName: string;


  @ApiPropertyOptional()
  @ApiProperty({
    example: '12 King Fahd Road',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string;


  @ApiPropertyOptional()
  @ApiProperty({
    example: 'Khobar',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;


  @ApiPropertyOptional()
  @ApiProperty({
    example: 'Eastern Province',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state: string;


  @ApiPropertyOptional()
  @ApiProperty({
    example: '31952',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({
    example: 'Trusted dealer for new and used cars.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;
}
