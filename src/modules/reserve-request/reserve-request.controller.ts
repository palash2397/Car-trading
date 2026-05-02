import { ReserveRequestService } from './reserve-request.service';

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
  ApiTags
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateReserveRequestDto } from './dto/create-reserve-request.dto';
import { UpdateReserveRequestStatusDto } from './dto/update-reserve-request-status.dto';

@ApiTags('Reserve-request')
@ApiBearerAuth('access-token')
@Controller('reserve-request')
export class ReserveRequestController {
  constructor(private readonly reserveRequestService: ReserveRequestService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createRequest(@Req() req: any, @Body() dto: CreateReserveRequestDto) {
    return this.reserveRequestService.createReserveRequest(req.user.id, dto);
  }

  @Get('/seller/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerReserveRequests(@Req() req: any) {
    return this.reserveRequestService.sellerReserveRequests(req.user.id);
  }

  @Get('/seller/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  async sellerReserveRequest(@Req() req: any, @Param('id') id: string) {
    return this.reserveRequestService.sellerReserveRequest(req.user.id, id);
  }

  @Patch('/seller/:id/status')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.USER)
  async updateRequestStatus(
    @Req() req: any,
    @Body() dto: UpdateReserveRequestStatusDto,
  ) {
    return this.reserveRequestService.updateReserveRequestStatus(
      req.user.id,
      dto,
    );
  }

  @Get('/buyer/all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerReserveRequests(@Req() req: any) {
    return this.reserveRequestService.buyerRequests(req.user.id);
  }

  @Get('/buyer/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerRequest(@Req() req: any, @Param('id') id: string) {
    return this.reserveRequestService.buyerRequest(req.user.id, id);
  }



  @Patch('/buyer/:id/cancel')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.ADMIN)
  async buyerCancelRequest(@Req() req: any, @Param('id') id: string) {
    return this.reserveRequestService.buyerCancelRequest(req.user.id, id);
  }

}
