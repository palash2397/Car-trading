import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTowerDto {
  @ApiPropertyOptional({
    example: 'Fast Track Towing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName: string;

  @ApiPropertyOptional({
    example: '45 Transport Street',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    example: 'Khobar',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({
    example: 'Eastern Province',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiPropertyOptional({
    example: '31952',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({
    example: 'Vehicle Towing',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serviceType: string;

  @ApiPropertyOptional({
    example: 'Flatbed Truck',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vehicleType?: string;

  @ApiPropertyOptional({
    example: 'Local and intercity vehicle towing service.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;
}
