import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/middleware/multer';

@ApiTags('Buyer')
@ApiBearerAuth('access-token')
@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateBuyerDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('buyer')))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateBuyerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buyerService.updateProfile(req.user.id, dto, file);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER)
  getProfile(@Req() req: any) {
    return this.buyerService.Profile(req.user.id);
  }

  @Get('/cars/list')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.USER)
  all() {
    return this.buyerService.findAll();
  }

  @Get('car/:id')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.USER)
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }
}
