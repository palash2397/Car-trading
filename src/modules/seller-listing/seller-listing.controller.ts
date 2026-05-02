import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  Delete,
} from '@nestjs/common';
import { SellerListingService } from './seller-listing.service';

import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { multerConfig } from 'src/common/middleware/multer';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { RoleGuard } from 'src/modules/auth/roles/roles.guard';

import { Role } from 'src/common/enums/user/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateSellerListingDto } from './dto/create-seller-listing';
import { UpdateSellerListingDto } from './dto/update-seller-listing';
import { DeleteCarImagesDto } from './dto/delete-car-images';

@ApiTags('Seller-Listing')
@ApiBearerAuth('access-token')
@Controller('seller-listing')
export class SellerListingController {
  constructor(private readonly sellerListingService: SellerListingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSellerListingDto })
  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfig('seller/listing')),
  )
  create(
    @Req() req: any,
    @Body() dto: CreateSellerListingDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.sellerListingService.create(req.user.id, dto, files);
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiParam({ name: 'id', type: String, example: '60d5ec49f1b2c72f8c8b4567' })
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       title: { type: 'string' },
  //       vin: { type: 'string' },
  //       make: { type: 'string' },
  //       model: { type: 'string' },
  //       year: { type: 'number' },
  //       condition: { type: 'string' },
  //       price: { type: 'number' },
  //       mileage: { type: 'number' },
  //       city: { type: 'string' },
  //       state: { type: 'string' },
  //       bodyStyle: { type: 'string' },
  //       images: {
  //         type: 'array',
  //         items: { type: 'string', format: 'binary' },
  //       },
  //     },
  //   },
  // })
  @ApiBody({ type: UpdateSellerListingDto })
  @UseInterceptors(
    FilesInterceptor('images', 10, multerConfig('seller/listing')),
  )
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSellerListingDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.sellerListingService.update(req.user.id, id, dto, files);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  all(@Req() req: any) {
    return this.sellerListingService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.sellerListingService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  delete(@Req() req: any, @Param('id') id: string) {
    return this.sellerListingService.delete(id, req.user.id);
  }

  // @Delete('images')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.SELLER, Role.ADMIN)
  // deleteImages(@Req() req: any, @Body() dto: DeleteCarImagesDto) {
  //   return this.sellerListingService.deleteListingImages(req.user.id, dto);
  // }
}
