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
}
