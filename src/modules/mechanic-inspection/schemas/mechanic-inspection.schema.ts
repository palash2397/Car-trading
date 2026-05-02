import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MechanicInspectionStatus } from 'src/common/enums/mechanic/mechanic-inspection-status.enum';

export type MechanicInspectionDocument = HydratedDocument<MechanicInspection>;

@Schema({
  timestamps: true,
})
export class MechanicInspection {
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
  mechanicId: Types.ObjectId;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  buyerMessage: string;

  @Prop({
    trim: true,
    default: '',
  })
  paymentSlip: string;

  @Prop({
    enum: MechanicInspectionStatus,
    default: MechanicInspectionStatus.PENDING,
  })
  status: MechanicInspectionStatus;

  @Prop({
    trim: true,
    maxlength: 2000,
    default: '',
  })
  mechanicReport: string;

  @Prop({
    trim: true,
    maxlength: 500,
    default: '',
  })
  overallCondition: string;

  @Prop({
    min: 0,
    max: 10,
    default: 0,
  })
  rating: number;

  @Prop({
    trim: true,
    maxlength: 1000,
    default: '',
  })
  sellerReply: string;
}

export const MechanicInspectionSchema =
  SchemaFactory.createForClass(MechanicInspection);
