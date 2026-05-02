import { Module } from '@nestjs/common';
import { SellerListingService } from './seller-listing.service';
import { SellerListingController } from './seller-listing.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  SellerListing,
  SellerListingSchema,
} from './schemas/seller-listing.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SellerListingController],
  providers: [SellerListingService],
  exports: [
    SellerListingService,
    MongooseModule.forFeature([
      { name: SellerListing.name, schema: SellerListingSchema },
    ]),
  ],
})
export class SellerListingModule {}
