import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './schema/buyer.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { SellerListing, SellerListingSchema } from '../seller-listing/schemas/seller-listing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: SellerListing.name, schema: SellerListingSchema }]),
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [
    BuyerService,
    MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class BuyerModule {}
