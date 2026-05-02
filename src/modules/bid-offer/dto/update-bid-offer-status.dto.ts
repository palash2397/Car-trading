import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BidOfferStatus } from 'src/common/enums/bid/bid-offer-status.enum';

export class UpdateBidOfferStatusDto {

  @ApiProperty({
    example: '60d5ec49f1b2c34567890abc',
  })
  @IsString()
  id: string;

  @ApiProperty({
    enum: BidOfferStatus,
    example: BidOfferStatus.ACCEPTED,
  })
  @IsEnum(BidOfferStatus)
  status: BidOfferStatus;

  @ApiPropertyOptional({
    example: 'Your offer has been accepted.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;
}