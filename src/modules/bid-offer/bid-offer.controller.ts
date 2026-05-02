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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BidOfferService } from './bid-offer.service';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateBidOfferDto } from './dto/create-bid-offer.dto';
import { UpdateBidOfferStatusDto } from './dto/update-bid-offer-status.dto';

@ApiTags('Bid-offer')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('bid-offer')
export class BidOfferController {
  constructor(private readonly bidOfferService: BidOfferService) {}

  @Post('/create')
  @Roles(Role.USER, Role.ADMIN)
  create(@Body() dto: CreateBidOfferDto, @Req() req: any) {
    return this.bidOfferService.createBidOffer(req.user.id, dto);
  }

  @Get('/seller/all')
  @Roles(Role.SELLER, Role.ADMIN)
  sellerBidOffers(@Req() req: any) {
    return this.bidOfferService.sellerBidOfferRequests(req.user.id);
  }

  @Get('/seller/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerBuyRequest(@Req() req: any, @Param('id') id: string) {
    return this.bidOfferService.sellerBidOfferRequest(req.user.id, id);
  }

  @Patch('seller/:id/status')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  async updateBidOfferStatus(
    @Req() req: any,
    @Body() dto: UpdateBidOfferStatusDto,
  ) {
    return this.bidOfferService.updateBidOfferStatus(req.user.id, dto);
  }

  @Get('/buyer/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequests(@Req() req: any) {
    return this.bidOfferService.buyerBidOfferRequests(req.user.id);
  }

  @Get('/buyer/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequest(@Req() req: any, @Param('id') id: string) {
    return this.bidOfferService.buyerBidOfferRequest(req.user.id, id);
  }
}
