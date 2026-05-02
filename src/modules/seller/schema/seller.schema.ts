import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SellerDocument = HydratedDocument<Seller>;

@Schema({
  timestamps: true,
})
export class Seller {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    trim: true,
    default: '',
  })
  address: string;

  @Prop({
    trim: true,
    default: '',
  })
  city: string;

  @Prop({
    trim: true,
    default: '',
  })
  state: string;

  @Prop({
    trim: true,
    default: '',
  })
  zipCode: string;

  @Prop({
    trim: true,
    default: '',
  })
  country: string;

  @Prop({
    trim: true,
    default: '',
  })
  avatar: string;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
