import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class IdParamDto {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
