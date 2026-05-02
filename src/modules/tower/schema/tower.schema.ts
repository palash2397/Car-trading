import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TowerDocument = HydratedDocument<Tower>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Tower {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    default: '',
    trim: true,
    maxlength: 100,
  })
  companyName: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 255,
  })
  address: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 100,
  })
  city: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 100,
  })
  state: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 20,
  })
  zipCode: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 100,
  })
  serviceType: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 100,
  })
  vehicleType: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 500,
  })
  description: string;

  @Prop({
    default: '',
    trim: true,
    maxlength: 255,
  })
  avatar: string;
}

export const TowerSchema = SchemaFactory.createForClass(Tower);