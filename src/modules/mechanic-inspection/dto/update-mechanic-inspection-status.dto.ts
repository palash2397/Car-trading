import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MechanicInspectionStatus } from 'src/common/enums/mechanic/mechanic-inspection-status.enum';

export class UpdateMechanicInspectionStatusDto {
  @ApiProperty({
    example: '69d73cf400e3037b3d6e77d3',
  })
  @IsMongoId()
  @IsNotEmpty()
  inspectionId: string;

  
  @ApiProperty({
    enum: MechanicInspectionStatus,
    example: MechanicInspectionStatus.IN_PROGRESS,
  })
  @IsEnum(MechanicInspectionStatus)
  status: MechanicInspectionStatus;

  @ApiPropertyOptional({
    example: 'Inspection has started.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  sellerReply?: string;
}
