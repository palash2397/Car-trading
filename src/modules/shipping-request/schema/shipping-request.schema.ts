import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ShippingStatus } from 'src/common/enums/tower/shipping-status.enum';

export type ShippingRequestDocument = HydratedDocument<ShippingRequest>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class ShippingRequest {
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
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  shippingProviderId: Types.ObjectId;

  @Prop({
    trim: true,
    maxlength: 255,
    required: true,
  })
  deliveryAddress: string;

  @Prop({
    trim: true,
    maxlength: 100,
    required: true,
  })
  city: string;

  @Prop({
    trim: true,
    maxlength: 100,
    required: true,
  })
  state: string;

  @Prop({
    trim: true,
    maxlength: 20,
    required: true,
  })
  zipCode: string;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  buyerMessage: string;

  @Prop({
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;

  @Prop({
    trim: true,
    maxlength: 255,
    default: '',
  })
  trackingLabel: string;

  @Prop({
    trim: true,
    maxlength: 255,
    default: '',
  })
  expectedDeliveryDate: string;

  @Prop({
    type: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  trackingHistory: {
    status: string;
    note?: string;
    updatedAt?: Date;
  }[];
}

export const ShippingRequestSchema =
  SchemaFactory.createForClass(ShippingRequest);
