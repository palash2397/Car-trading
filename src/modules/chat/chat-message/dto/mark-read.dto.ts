import { IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkReadDto {
  @ApiProperty()
  @IsArray()
  @IsMongoId({ each: true })
  messageIds: string[];
}