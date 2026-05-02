import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BidOfferType } from 'src/common/enums/bid/bid-offer-type.enum';

export class CreateBidOfferDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({
    enum: BidOfferType,
    example: BidOfferType.OFFER,
  })
  @IsEnum(BidOfferType)
  type: BidOfferType;

  @ApiProperty({
    example: 32500,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    example: 'I would like to offer this amount for the car.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}