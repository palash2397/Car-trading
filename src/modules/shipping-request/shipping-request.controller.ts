import { ShippingRequestService } from './shipping-request.service';

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
  All,
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

import { CreateShippingRequestDto } from './dto/create-shipping-request.dto';
import { AssignShippingProviderDto } from './dto/assign-shipping-provider.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

@ApiTags('Shipping Request')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('shipping-request')
export class ShippingRequestController {
  constructor(
    private readonly shippingRequestService: ShippingRequestService,
  ) {}

  @Post('create')
  @Roles(Role.USER, Role.ADMIN)
  async createShippingRequest(
    @Req() req: any,
    @Body() dto: CreateShippingRequestDto,
  ) {
    return this.shippingRequestService.createShippingRequest(req.user.id, dto);
  }

  @Get('buyer/all')
  @Roles(Role.USER, Role.ADMIN)
  async buyerShippingRequests(@Req() req: any) {
    return this.shippingRequestService.buyerShippingRequests(req.user.id);
  }

  @Get('buyer/:id')
  @Roles(Role.USER, Role.ADMIN)
  async buyerShippingRequest(@Req() req: any, @Param('id') id: string) {
    return this.shippingRequestService.buyerShippingRequest(req.user.id, id);
  }

  @Get('seller/all')
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerShippingRequests(@Req() req: any) {
    return this.shippingRequestService.sellerShippingRequests(req.user.id);
  }


  @Get('seller/:id')
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerShippingRequest(@Req() req: any, @Param('id') id: string) {
    return this.shippingRequestService.sellerShippingRequest(req.user.id, id);
  }

  @Get('tower/all')
  @Roles(Role.TOWER, Role.ADMIN)
  async towerShippingRequests(@Req() req: any) {
    return this.shippingRequestService.towerShippingRequests(req.user.id);
  }

  @Patch('seller/assign')
  @Roles(Role.SELLER, Role.ADMIN)
  async assignShippingProvider(
    @Req() req: any,
    @Body() dto: AssignShippingProviderDto,
  ) {
    return this.shippingRequestService.assignShippingProvider(
      req.user.id,

      dto,
    );
  }

  @Patch('provider/status')
  @Roles(Role.TOWER)
  async updateShippingStatus(
    @Req() req: any,
    @Body() dto: UpdateShippingStatusDto,
  ) {
    return this.shippingRequestService.updateShippingStatus(req.user.id, dto);
  }
}
