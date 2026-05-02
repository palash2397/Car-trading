import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SellerListingDocument = HydratedDocument<SellerListing>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class SellerListing {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sellerId: Types.ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  vin: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  make: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  model: string;

  @Prop({
    required: true,
    min: 1900,
  })
  year: number;

  @Prop({
    required: true,
    trim: true,
    maxlength: 50,
  })
  condition: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    default: 0,
    min: 0,
  })
  mileage: number;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  city: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  state: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  bodyStyle: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  exteriorColor: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  interiorColor: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  transmission: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  fuelType: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  engine: string;

  @Prop({
    trim: true,
    maxlength: 50,
    default: '',
  })
  driveType: string;

  @Prop({
    default: 4,
    min: 1,
  })
  doors: number;

  @Prop({
    trim: true,
    maxlength: 2000,
    default: '',
  })
  sellerComments: string;

  @Prop({
    default: false,
  })
  isAuction: boolean;

  @Prop({
    default: 0,
    min: 0,
  })
  currentBid: number;

  @Prop({
    type: [
      {
        url: String,
        // publicId: String,
        // isPrimary: Boolean,
      },
    ],
    default: [],
  })
  images: [
    {
      url: string;
      // publicId: string;
      // isPrimary: boolean;
      // sortOrder: number;
    },
  ];

  @Prop({
    default: 0,
    min: 0,
  })
  reservePrice: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isSold: boolean;
}

export const SellerListingSchema = SchemaFactory.createForClass(SellerListing);
