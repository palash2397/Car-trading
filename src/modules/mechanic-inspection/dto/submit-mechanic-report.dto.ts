import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
} from 'class-validator';

export class SubmitMechanicReportDto {

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  inspectionId: string;

  @ApiProperty({
    example:
      'Vehicle is in good condition overall. Minor suspension wear found.',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  mechanicReport: string;

  @ApiPropertyOptional({
    example: 'Good',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  overallCondition?: string;

  @ApiPropertyOptional({
    example: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;
}
