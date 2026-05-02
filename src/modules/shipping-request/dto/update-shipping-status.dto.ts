import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ShippingStatus } from 'src/common/enums/tower/shipping-status.enum';

export class UpdateShippingStatusDto {
  @ApiProperty({
    example: '69f5cbdeadc8cd112056476e',
  })
  @IsString()
  @MaxLength(255)
  requestId: string;

  @ApiProperty({
    enum: ShippingStatus,
    example: ShippingStatus.IN_TRANSIT,
  })
  @IsEnum(ShippingStatus)
  status: ShippingStatus;

  @ApiPropertyOptional({
    example: 'The car is on the road. Expected delivery 3/9/2024',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @ApiPropertyOptional({
    example: 'LBL-2026-0001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  trackingLabel?: string;

  @ApiPropertyOptional({
    example: '2026-05-05',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  expectedDeliveryDate?: string;
}
