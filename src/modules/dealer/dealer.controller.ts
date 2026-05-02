import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DealerService } from './dealer.service';

import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { multerConfig } from 'src/common/middleware/multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { UpdateDealerDto } from './dto/update-dealer.dto';

@ApiTags('Dealer')
@ApiBearerAuth('access-token')
@Controller('dealer')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DEALER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateDealerDto })
  @UseInterceptors(FileInterceptor('avatar', multerConfig('dealer')))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateDealerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.dealerService.updateProfile(req.user.id, dto, file);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DEALER)
  getProfile(@Req() req: any) {
    return this.dealerService.Profile(req.user.id);
  }
}
