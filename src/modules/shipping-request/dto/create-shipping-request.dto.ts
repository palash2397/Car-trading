import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShippingRequestDto {
  @ApiProperty({
    example: '69dcdcf157d393465ad4cc20',
  })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({
    example: '221B Baker Street',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  deliveryAddress: string;

  @ApiProperty({
    example: 'Khobar',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    example: 'Eastern Province',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({
    example: '31952',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({
    example: 'Please deliver carefully and call before arrival.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  buyerMessage?: string;
}