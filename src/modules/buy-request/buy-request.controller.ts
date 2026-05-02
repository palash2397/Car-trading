import { BuyerRequestService } from './buy-request.service';

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

import { CreateBuyRequestDto } from './dto/create-buy-request.dto';
import { UpdateBuyRequestStatusDto } from './dto/update-buy-request-status.dto';

@ApiTags('Buy-request')
@ApiBearerAuth('access-token')
@Controller('buy-request')
export class BuyerRequestController {
  constructor(private readonly buyerRequestService: BuyerRequestService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createRequest(@Req() req: any, @Body() dto: CreateBuyRequestDto) {
    return this.buyerRequestService.createBuyRequest(req.user.id, dto);
  }

  @Get('/seller/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerBuyRequests(@Req() req: any) {
    return this.buyerRequestService.sellerBuyRequests(req.user.id);
  }

  @Get('/seller/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerBuyRequest(@Req() req: any, @Param('id') id: string) {
    return this.buyerRequestService.sellerBuyRequest(req.user.id, id);
  }

  @Patch('seller/:id/status')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async updateBuyRequestStatus(
    @Req() req: any,
    @Body() dto: UpdateBuyRequestStatusDto,
  ) {
    return this.buyerRequestService.updateBuyRequestStatus(
      req.user.id,
      dto.requestId,
      dto,
    );
  }

  @Get('/buyer/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequests(@Req() req: any) {
    return this.buyerRequestService.buyerBuyRequests(req.user.id);
  }

  @Get('/buyer/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequest(@Req() req: any, @Param('id') id: string) {
    return this.buyerRequestService.buyerBuyRequest(req.user.id, id);
  }

  @Patch('/buyer/:id/cancel')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerCancelRequest(@Req() req: any, @Param('id') id: string) {
    return this.buyerRequestService.buyerCancelRequest(req.user.id, id);
  }
}
