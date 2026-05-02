import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BuyMode } from 'src/common/enums/buyer/buy-mode.enum';
import { BuyRequestStatus } from 'src/common/enums/buyer/buy-request-status.enum';

export type BuyRequestDocument = HydratedDocument<BuyRequest>;

@Schema({
  timestamps: true,
})
export class BuyRequest {
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
    enum: BuyMode,
    required: true,
  })
  buyMode: BuyMode;

  @Prop({
    default: false,
  })
  needDelivery: boolean;

  @Prop({
    default: false,
  })
  needDetailing: boolean;

  @Prop({
    default: false,
  })
  needProfessionalCheck: boolean;

  @Prop({
    default: false,
  })
  useGuaranteedTransaction: boolean;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  message: string;

  @Prop({
    enum: BuyRequestStatus,
    default: BuyRequestStatus.PENDING,
  })
  status: BuyRequestStatus;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  sellerReply: string;
}

export const BuyRequestSchema = SchemaFactory.createForClass(BuyRequest);
