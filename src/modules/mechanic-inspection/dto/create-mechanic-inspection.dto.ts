import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMechanicInspectionDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiPropertyOptional({
    example: 'Please inspect the engine and overall condition carefully.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  buyerMessage?: string;
}