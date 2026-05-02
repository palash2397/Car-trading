import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';     
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';


export class DeleteCarImagesDto {


  @ApiProperty({ description: 'Listing ID', example: '60d5ec49f1b2c72f8c8b4567' })
  @IsMongoId()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty({ description: 'Image IDs to delete', example: ['60d5ec49f1b2c72f8c8b4568', '60d5ec49f1b2c72f8c8b4569'] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  imageIds: string[];
    

    
}