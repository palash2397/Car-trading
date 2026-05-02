import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReserveRequestService } from './reserve-request.service';
import { ReserveRequestController } from './reserve-request.controller';
import {
  ReserveRequest,
  ReserveRequestSchema,
} from './schema/reserve-request.schema';

import {
  SellerListing,
  SellerListingSchema,
} from '../seller-listing/schemas/seller-listing.schema';

import { Buyer, BuyerSchema } from '../buyer/schema/buyer.schema';
import { Seller, SellerSchema } from '../seller/schema/seller.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReserveRequest.name, schema: ReserveRequestSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [ReserveRequestController],
  providers: [ReserveRequestService],
  exports: [
    ReserveRequestService,
    MongooseModule.forFeature([
      { name: ReserveRequest.name, schema: ReserveRequestSchema },
    ]),
  ],
})
export class ReserveRequestModule {}
