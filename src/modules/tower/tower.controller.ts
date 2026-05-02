import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/middleware/multer';

import { TowerService } from './tower.service';

import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { UpdateTowerDto } from './dto/update-tower.dto';

@ApiTags('Tower')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tower')
export class TowerController {
  constructor(private readonly towerService: TowerService) {}

  @Post('/profile')
  @Roles(Role.TOWER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTowerDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('tower')))
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateTowerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // console.log('dto ----------->', dto);
    // console.log('file ----------->', file);
    return this.towerService.updateProfile(req.user.id, dto, file);
  }

  @Get('profile')
  @Roles(Role.TOWER)
  getProfile(@Req() req: any) {
    return this.towerService.Profile(req.user.id);
  }
}
