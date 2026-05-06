import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaymentTransferStatus } from 'src/common/enums/payment/payment-transfer-status.enum';



export class UpdatePaymentTransferStatusDto {
  @ApiProperty({
    enum: PaymentTransferStatus,
    example: PaymentTransferStatus.PAYMENT_VERIFIED,
  })
  @IsEnum(PaymentTransferStatus)
  status: PaymentTransferStatus;

  @ApiPropertyOptional({
    example: 'Payment has been verified successfully.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;

  @ApiPropertyOptional({
    example: 'TXN-2026-0001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  transferReference?: string;
}