import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PaymentTransfer,
  PaymentTransferDocument,
} from './schema/payment-transfer.schema';
import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class PaymentTransferService {
  constructor(
    @InjectModel(PaymentTransfer.name)
    private readonly paymentTransferModel: Model<PaymentTransferDocument>,
    
    @InjectModel(SellerListing.name)
    private readonly sellerListingModel: Model<SellerListingDocument>,
  ) {}

//   async createPaymentTransfer(
//     buyerId: string,
//     dto: CreatePaymentTransferDto,
//     file?: Express.Multer.File,
//   ) {
//     try {
//       const listing = await this.sellerListingModel.findById(dto.listingId);

//       if (!listing) {
//         return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
//       }

//       const paymentTransfer = await this.paymentTransferModel.create({
//         listingId: new Types.ObjectId(dto.listingId),
//         buyerId: new Types.ObjectId(buyerId),
//         sellerId: listing.sellerId, // change to listing.userId if needed
//         amount: dto.amount,
//         paymentProof: file?.filename || '',
//         buyerMessage: dto.buyerMessage || '',
//         status: file
//           ? PaymentTransferStatus.PAYMENT_PROOF_UPLOADED
//           : PaymentTransferStatus.PENDING_PAYMENT,
//       });

//       return new ApiResponse(
//         201,
//         paymentTransfer,
//         'Payment transfer created successfully',
//       );
//     } catch (error) {
//       console.log(`Error creating payment transfer: ${error}`);
//       return new ApiResponse(500, {}, Msg.SERVER_ERROR);
//     }
//   }
}
