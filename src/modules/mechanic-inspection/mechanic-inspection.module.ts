import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MechanicInspectionService } from './mechanic-inspection.service';
import { MechanicInspectionController } from './mechanic-inspection.controller';
import {
  MechanicInspection,
  MechanicInspectionSchema,
} from './schemas/mechanic-inspection.schema';

import { SellerListing, SellerListingSchema } from '../seller-listing/schemas/seller-listing.schema';

import { Mechanic, MechanicSchema } from '../mechanic/schemas/mechanic.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MechanicInspection.name, schema: MechanicInspectionSchema },
      { name: Mechanic.name, schema: MechanicSchema },
      { name: User.name, schema: UserSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
    ]),
  ],
  controllers: [MechanicInspectionController],
  providers: [MechanicInspectionService],
  exports: [
    MechanicInspectionService,
    MongooseModule.forFeature([
      { name: MechanicInspection.name, schema: MechanicInspectionSchema },
      { name: Mechanic.name, schema: MechanicSchema },
      { name: User.name, schema: UserSchema },
      { name: SellerListing.name, schema: SellerListingSchema },
    ]),
  ],
})
export class MechanicInspectionModule {}
