import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignMechanicDto {
  @ApiProperty({
    example: '69d73cf400e3037b3d6e77d3',
  })
  @IsMongoId()
  @IsNotEmpty()
  mechanicId: string;

  @ApiProperty({
    example: '69d73cf400e3037b3d6e77d3',
  })
  @IsMongoId()
  @IsNotEmpty()
  inspectionId: string;
}
