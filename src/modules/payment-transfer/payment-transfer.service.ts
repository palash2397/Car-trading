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

@Injectable()
export class PaymentTransferService {}
