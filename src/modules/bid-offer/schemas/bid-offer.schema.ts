import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BidOfferType } from 'src/common/enums/bid/bid-offer-type.enum';
import { BidOfferStatus } from 'src/common/enums/bid/bid-offer-status.enum';

export type BidOfferDocument = HydratedDocument<BidOffer>;

@Schema({
  timestamps: true
})
export class BidOffer {
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
    enum: BidOfferType,
    required: true,
  })
  type: BidOfferType;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  message: string;

  @Prop({
    enum: BidOfferStatus,
    default: BidOfferStatus.PENDING,
  })
  status: BidOfferStatus;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  sellerReply: string;
}

export const BidOfferSchema = SchemaFactory.createForClass(BidOffer);