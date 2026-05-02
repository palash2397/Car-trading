import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SellerRequestType } from 'src/common/enums/seller/seller-request-type.enum';

export class CreateSellerRequestDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({
    enum: SellerRequestType,
    example: SellerRequestType.TEST_DRIVE,
  })
  @IsEnum(SellerRequestType)
  requestType: SellerRequestType;

  @ApiPropertyOptional({
    example: 'Hello, I would like to schedule a test drive for this car.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
