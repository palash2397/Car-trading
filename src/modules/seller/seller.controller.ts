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
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { multerConfig } from 'src/common/middleware/multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Seller')
@ApiBearerAuth('access-token')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('seller')))
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // console.log('dto ----------->', dto);
    // console.log('file ----------->', file);
    return this.sellerService.updateProfile(req.user.id, dto, file);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  getProfile(@Req() req: any) {
    return this.sellerService.Profile(req.user.id);
  }

  @Get('/mechanics/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  allMechanics() {
    return this.sellerService.allMechanics();
  }

  @Get('/mechanics/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  mechanicById(@Param('id') mechanicId: string) {
    return this.sellerService.mechanicById(mechanicId);
  }

  @Get('/towers/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  allTowers() {
    return this.sellerService.allTowers();
  }

  @Get('/tower/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  towerById(@Param('id') towerId: string) {
    return this.sellerService.towerById(towerId);
  }
}
