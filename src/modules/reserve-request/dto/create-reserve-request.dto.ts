import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReserveRequestDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiPropertyOptional({
    example: 'Please reserve this car for me for one day.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowContactByEmail?: boolean;

  @ApiPropertyOptional({
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  allowContactByPhone?: boolean;
}