import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReserveRequestStatus } from 'src/common/enums/seller/reserve-request-status.enum';

export class UpdateReserveRequestStatusDto {

  @ApiProperty({
    example: '60d5ec49f1b2c3d4e5f6a7b8',
  })
  @IsString()
  requestId: string;

  @ApiProperty({
    enum: ReserveRequestStatus,
    example: ReserveRequestStatus.ACCEPTED,
  })
  @IsEnum(ReserveRequestStatus)
  status: ReserveRequestStatus;

  @ApiPropertyOptional({
    example: 'Okay, I will hold this car for you until tomorrow.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;
}