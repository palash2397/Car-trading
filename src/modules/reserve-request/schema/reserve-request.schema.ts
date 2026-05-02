import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReserveRequestStatus } from 'src/common/enums/seller/reserve-request-status.enum';

export type ReserveRequestDocument = HydratedDocument<ReserveRequest>;

@Schema({
  timestamps: true,
})
export class ReserveRequest {
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
    enum: ReserveRequestStatus,
    default: ReserveRequestStatus.PENDING,
  })
  status: ReserveRequestStatus;

  @Prop({
    default: true,
  })
  allowContactByEmail: boolean;

  @Prop({
    default: false,
  })
  allowContactByPhone: boolean;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  message: string;

  @Prop({
    required: true,
  })
  reserveUntil: Date;
}

export const ReserveRequestSchema =
  SchemaFactory.createForClass(ReserveRequest);
