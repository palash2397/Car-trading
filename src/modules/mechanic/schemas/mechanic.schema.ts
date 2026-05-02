import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MechanicDocument = HydratedDocument<Mechanic>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Mechanic {
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
  garageName: string;

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
    maxlength: 100,
    default: '',
  })
  serviceType: string;

  @Prop({
    trim: true,
    maxlength: 500,
    default: '',
  })
  description: string;

  @Prop({
    trim: true,
    maxlength: 255,
    default: '',
  })
  avatar: string;
}

export const MechanicSchema =
  SchemaFactory.createForClass(Mechanic);
