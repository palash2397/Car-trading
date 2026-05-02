import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BuyRequestStatus } from 'src/common/enums/buyer/buy-request-status.enum';

export class UpdateBuyRequestStatusDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    enum: BuyRequestStatus,
    example: BuyRequestStatus.ACCEPTED,
  })
  @IsEnum(BuyRequestStatus)
  status: BuyRequestStatus;

  @ApiPropertyOptional({
    example:
      'Your buy request is accepted. Please continue with the next step.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;
}
