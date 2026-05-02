import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { MechanicService } from './mechanic.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { UpdateMechanicProfileDto } from './dto/update-mechanic.dto';
import { multerConfig } from 'src/common/middleware/multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Mechanic')
@ApiBearerAuth('access-token')
@Controller('mechanic')
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MECHANIC)
  @UseInterceptors(FileInterceptor('avatar', multerConfig('mechanic')))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateMechanicProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mechanicService.updateProfile(req.user.id, dto, file);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MECHANIC)
  getProfile(@Req() req: any) {
    return this.mechanicService.Profile(req.user.id);
  }
}
