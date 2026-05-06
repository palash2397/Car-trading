import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentTransferService } from './payment-transfer.service';
import { PaymentTransferController } from './payment-transfer.controller';

import { SellerListing, SellerListingSchema } from '../seller-listing/schemas/seller-listing.schema';
import { PaymentTransfer, PaymentTransferSchema } from './schema/payment-transfer.schema';

@Module({
  controllers: [PaymentTransferController],
  providers: [PaymentTransferService],
  imports: [
    MongooseModule.forFeature([
      { name: SellerListing.name, schema: SellerListingSchema },
      { name: PaymentTransfer.name, schema: PaymentTransferSchema },
    ]),
  ],

  exports: [
    PaymentTransferService,
    MongooseModule.forFeature([
      { name: PaymentTransfer.name, schema: PaymentTransferSchema },
    ]),
  ],
})
export class PaymentTransferModule {}
