import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { BuyMode } from 'src/common/enums/buyer/buy-mode.enum';

export class CreateBuyRequestDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({
    enum: BuyMode,
    example: BuyMode.ONLINE,
  })
  @IsEnum(BuyMode)
  buyMode: BuyMode;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  needDelivery?: boolean;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  needDetailing?: boolean;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  needProfessionalCheck?: boolean;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  useGuaranteedTransaction?: boolean;

  @ApiPropertyOptional({
    example: 'I want to proceed with buying this car.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
