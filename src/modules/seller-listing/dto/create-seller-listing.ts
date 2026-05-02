import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSellerListingDto {
  @ApiProperty({
    example: 'Used 2023 Toyota Corolla',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'string',
  })
  @IsNotEmpty()
  @IsString()
  vin: string;

  @ApiProperty({
    example: 'Toyota',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  make: string;

  @ApiProperty({
    example: 'Corolla',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  model: string;

  @ApiProperty({
    example: 2023,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  year: number;

  @ApiProperty({
    example: 'Used',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  condition: string;

  @ApiProperty({
    example: 25305,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 36964,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileage?: number;

  @ApiProperty({
    example: 'Khobar',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    example: 'Eastern Province',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiPropertyOptional({
    example: 'Sedan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodyStyle?: string;

  @ApiPropertyOptional({
    example: 'Black',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  exteriorColor?: string;

  @ApiPropertyOptional({
    example: 'Brown',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  interiorColor?: string;

  @ApiPropertyOptional({
    example: 'Automatic',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  transmission?: string;

  @ApiPropertyOptional({
    example: 'Gasoline',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fuelType?: string;

  @ApiPropertyOptional({
    example: '4 Cylinder',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  engine?: string;

  @ApiPropertyOptional({
    example: 'Front wheel drive',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  driveType?: string;

  @ApiPropertyOptional({
    example: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  doors?: number;

  @ApiPropertyOptional({
    example: 'Well maintained car with full service history.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  sellerComments?: string;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAuction?: boolean;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentBid?: number;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reservePrice?: number;

  @ApiPropertyOptional({
    example: 'Active listing with great condition',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', isArray: true })
  @IsOptional()
  images?: string[];
}
