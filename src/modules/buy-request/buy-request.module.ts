import { Module } from '@nestjs/common';
import { BuyerRequestService } from './buy-request.service';
import { BuyerRequestController } from './buy-request.controller';

import { BuyRequest, BuyRequestSchema } from './schemas/buy-request.schema';
import {
  SellerListing,
  SellerListingSchema,
} from '../seller-listing/schemas/seller-listing.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Buyer, BuyerSchema } from '../buyer/schema/buyer.schema';
import { Seller, SellerSchema } from '../seller/schema/seller.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BuyRequest.name, schema: BuyRequestSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: User.name, schema: UserSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: Seller.name, schema: SellerSchema },
    ]),
  ],
  controllers: [BuyerRequestController],
  providers: [BuyerRequestService],
  exports: [
    BuyerRequestService,
    MongooseModule.forFeature([
      { name: BuyRequest.name, schema: BuyRequestSchema },
    ]),
  ],
})
export class BuyerRequestModule {}
