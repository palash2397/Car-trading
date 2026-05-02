import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { SellerRequestStatus } from 'src/common/enums/seller/seller-request-status.enum';
import { SellerRequestType } from 'src/common/enums/seller/seller-request-type.enum';

export type SellerRequestDocument = HydratedDocument<SellerRequest>;

@Schema({
  timestamps: true,
})
export class SellerRequest {
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
    enum: SellerRequestType,
    required: true,
  })
  requestType: SellerRequestType;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  message: string;

  @Prop({
    enum: SellerRequestStatus,
    default: SellerRequestStatus.PENDING,
  })
  status: SellerRequestStatus;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  sellerReply: string;
}

export const SellerRequestSchema = SchemaFactory.createForClass(SellerRequest);
