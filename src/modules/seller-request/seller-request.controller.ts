import { SellerRequestService } from './seller-request.service';

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateSellerRequestDto } from './dto/create-seller-request.dto';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';

@ApiTags('Seller-request')
@ApiBearerAuth('access-token')
@Controller('seller-request')
export class SellerRequestController {
  constructor(private readonly sellerRequestService: SellerRequestService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async createRequest(@Req() req: any, @Body() dto: CreateSellerRequestDto) {
    return this.sellerRequestService.createRequest(req.user.id, dto);
  }


  @Get('/seller/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerRequests(@Req() req: any) {
    return this.sellerRequestService.sellerRequests(req.user.id);
  }

  @Get('/seller/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerRequest(@Req() req: any, @Param('id') id: string) {
    return this.sellerRequestService.sellerRequest(req.user.id, id);
  }

  @Patch('/seller/:id/status')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.USER)
  async updateRequestStatus(
    @Req() req: any,
    @Body() dto: UpdateSellerRequestStatusDto,
  ) {
    return this.sellerRequestService.updateRequestStatus(req.user.id, dto);
  }



  @Get('/buyer/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequests(@Req() req: any) {
    return this.sellerRequestService.buyerRequests(req.user.id);
  }


  @Get('/buyer/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequest(@Req() req: any, @Param('id') id: string) {
    return this.sellerRequestService.buyerRequest(req.user.id, id);
  }

  @Patch('/buyer/:id/cancel')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerCancelRequest(@Req() req: any, @Param('id') id: string) {
    return this.sellerRequestService.buyerCancelRequest(req.user.id, id);
  }
}
