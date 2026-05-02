import { MechanicInspectionService } from './mechanic-inspection.service';

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

import { CreateMechanicInspectionDto } from './dto/create-mechanic-inspection.dto';
import { UpdateMechanicInspectionStatusDto } from './dto/update-mechanic-inspection-status.dto';
import { AssignMechanicDto } from './dto/assign-mechanic.dto';
import { SubmitMechanicReportDto } from './dto/submit-mechanic-report.dto';

@ApiTags('Mechanic Inspection')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('mechanic-inspection')
export class MechanicInspectionController {
  constructor(
    private readonly mechanicInspectionService: MechanicInspectionService,
  ) {}

  @Post('create')
  @Roles(Role.USER, Role.ADMIN)
  async createInspectionRequest(
    @Req() req: any,
    @Body() dto: CreateMechanicInspectionDto,
  ) {
    return this.mechanicInspectionService.createInspectionRequest(
      req.user.id,
      dto,
    );
  }

  @Get('seller/all')
  @Roles(Role.SELLER, Role.ADMIN)
  async sellerInspectionRequests(@Req() req: any) {
    return this.mechanicInspectionService.sellerInspectionRequests(req.user.id);
  }

  @Patch('seller/assign')
  @Roles(Role.SELLER, Role.ADMIN)
  async assignMechanic(@Req() req: any, @Body() dto: AssignMechanicDto) {
    return this.mechanicInspectionService.assignMechanic(req.user.id, dto);
  }

  @Get('mechanic/all')
  @Roles(Role.MECHANIC, Role.ADMIN)
  async mechanicInspectionsRequests(@Req() req: any) {
    return this.mechanicInspectionService.mechanicInspectionsRequests(
      req.user.id,
    );
  }

  @Patch('mechanic/status')
  @Roles(Role.MECHANIC)
  async updateInspectionStatus(
    @Req() req: any,
    @Body() dto: UpdateMechanicInspectionStatusDto,
  ) {
    return this.mechanicInspectionService.updateInspectionStatus(
      req.user.id,
      dto,
    );
  }

  @Patch('mechanic/report')
  @Roles(Role.MECHANIC)
  async submitMechanicReport(
    @Req() req: any,
    @Body() dto: SubmitMechanicReportDto,
  ) {
    return this.mechanicInspectionService.submitMechanicReport(req.user.id, dto);
  }

  @Get('buyer/all')
  @Roles(Role.USER, Role.ADMIN)
  async buyerInspectionRequests(@Req() req: any) {
    return this.mechanicInspectionService.buyerInspectionRequests(req.user.id);
  }
}
