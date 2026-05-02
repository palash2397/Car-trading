import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSellerListingDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  vin: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  make: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  model: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1900)
  year: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  condition: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodyStyle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  exteriorColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  interiorColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  transmission?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  fuelType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  engine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  driveType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  doors?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sellerComments?: string;

  @IsOptional()
  @IsBoolean()
  isAuction?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentBid?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reservePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', isArray: true })
  @IsOptional()
  images?: string[];
}
