import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { SellerRequestStatus } from 'src/common/enums/seller/seller-request-status.enum';

export class UpdateSellerRequestStatusDto {
  @ApiProperty({
    example: '60d5ec49f1b2c3d4e5f6a7b8',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    enum: SellerRequestStatus,
    example: SellerRequestStatus.ACCEPTED,
  })
  @IsEnum(SellerRequestStatus)
  status: SellerRequestStatus;

  @ApiPropertyOptional({
    example: 'Sure, please come tomorrow at 5 PM.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;
}
