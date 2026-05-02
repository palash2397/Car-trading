import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DealerDocument = HydratedDocument<Dealer>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Dealer {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    trim: true,
    maxlength: 100,
    default: '',
  })
  companyName: string;

  @Prop({
    trim: true,
    maxlength: 255,
    default: '',
  })
  address: string;

  @Prop({
    trim: true,
    maxlength: 100,
    default: '',
  })
  city: string;

  @Prop({
    trim: true,
    maxlength: 100,
    default: '',
  })
  state: string;

  @Prop({
    trim: true,
    maxlength: 20,
    default: '',
  })
  zipCode: string;

  @Prop({
    trim: true,
    maxlength: 500,
    default: '',
  })
  description: string;

  @Prop({
    trim: true,
    default: '',
  })
  avatar: string;
}

export const DealerSchema = SchemaFactory.createForClass(Dealer);
