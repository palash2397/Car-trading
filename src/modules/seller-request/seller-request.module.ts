import { Module } from '@nestjs/common';
import { SellerRequestService } from './seller-request.service';
import { SellerRequestController } from './seller-request.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  SellerRequest,
  SellerRequestSchema,
} from './schema/seller-request.schema';

import {
  SellerListing,
  SellerListingSchema,
} from '../seller-listing/schemas/seller-listing.schema';

import {
  Seller,
  SellerSchema,
} from '../seller/schema/seller.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerRequest.name, schema: SellerRequestSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [SellerRequestController],
  providers: [SellerRequestService],
  exports: [
    SellerRequestService,
    MongooseModule.forFeature([
      { name: SellerRequest.name, schema: SellerRequestSchema },
    ]),
  ],
})
export class SellerRequestModule {}
