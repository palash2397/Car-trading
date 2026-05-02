import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingRequestService } from './shipping-request.service';
import { ShippingRequestController } from './shipping-request.controller';
import {
  ShippingRequest,
  ShippingRequestSchema,
} from './schema/shipping-request.schema';

import {
  SellerListing,
  SellerListingSchema,
} from '../seller-listing/schemas/seller-listing.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Tower, TowerSchema } from '../tower/schema/tower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShippingRequest.name, schema: ShippingRequestSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: User.name, schema: UserSchema },
      { name: Tower.name, schema: TowerSchema },
    ]),
  ],
  controllers: [ShippingRequestController],
  providers: [ShippingRequestService],
  exports: [
    ShippingRequestService,
    MongooseModule.forFeature([
      { name: ShippingRequest.name, schema: ShippingRequestSchema },
    ]),
  ],
})
export class ShippingRequestModule {}
