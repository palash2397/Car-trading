import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentTransferStatus } from 'src/common/enums/payment/payment-transfer-status.enum';


export type PaymentTransferDocument = HydratedDocument<PaymentTransfer>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class PaymentTransfer {
  @Prop({
    type: Types.ObjectId,
    ref: 'SellerListing',
    required: true,
  })
  listingId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  buyerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sellerId: Types.ObjectId;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    trim: true,
    default: '',
  })
  paymentProof: string;

  @Prop({
    enum: PaymentTransferStatus,
    default: PaymentTransferStatus.PENDING_PAYMENT,
  })
  status: PaymentTransferStatus;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  buyerMessage: string;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  sellerReply: string;

  @Prop({
    trim: true,
    maxlength: 255,
    default: '',
  })
  transferReference: string;
}

export const PaymentTransferSchema =
  SchemaFactory.createForClass(PaymentTransfer);