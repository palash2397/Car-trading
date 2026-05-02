import { Module } from '@nestjs/common';
import { BidOfferService } from './bid-offer.service';
import { BidOfferController } from './bid-offer.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { BidOffer, BidOfferSchema } from './schemas/bid-offer.schema';
import {
  SellerListing,
  SellerListingSchema,
} from '../seller-listing/schemas/seller-listing.schema';
import { Seller, SellerSchema } from '../seller/schema/seller.schema';
import { Buyer, BuyerSchema } from '../buyer/schema/buyer.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BidOffer.name, schema: BidOfferSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: Seller.name, schema: SellerSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BidOfferController],
  providers: [BidOfferService],
  exports: [
    BidOfferService,
    MongooseModule.forFeature([
      { name: BidOffer.name, schema: BidOfferSchema },
    ]),
  ],
})
export class BidOfferModule {}
