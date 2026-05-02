import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Buyer, BuyerDocument } from './schema/buyer.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import { UpdateBuyerDto } from './dto/update-buyer.dto';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { deleteOldFile } from 'src/utils/helpers';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name) private buyerModel: Model<BuyerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SellerListing.name)
    private sellerListingModel: Model<SellerListingDocument>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateBuyerDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const buyer = await this.buyerModel.findOneAndUpdate(
        { user: user._id },
        { ...dto, user: user._id },
        { new: true, upsert: true },
      );
      console.log(buyer);
      if (!buyer) {
        return new ApiResponse(404, {}, Msg.BUYER_NOT_FOUND);
      }

      if (file) {
        await deleteOldFile('buyer', buyer.avatar);
        buyer.avatar = file.filename;
        await buyer.save();
      }

      return new ApiResponse(200, buyer, Msg.BUYER_UPDATED);
    } catch (error) {
      console.error('Error updating buyer profile:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async Profile(userId: string) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const buyer = await this.buyerModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user');
      if (!buyer) {
        return new ApiResponse(200, user, Msg.BUYER_NOT_FOUND);
      }

      buyer.avatar = buyer.avatar
        ? `${process.env.BASE_URL}/uploads/buyer/${buyer.avatar}`
        : '';
      return new ApiResponse(200, buyer, Msg.BUYER_PROFILE_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const listings = await this.sellerListingModel
        .find({})
        .populate('sellerId', 'firstName lastName email roles');

      if (!listings || listings.length === 0) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      listings.forEach((listing) => {
        listing.images = listing.images.map((image) => ({
          url: image.url
            ? `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`
            : '',
        })) as [{ url: string }];
      });
      return new ApiResponse(200, listings, Msg.LISTING_FETCHED);
    } catch (error) {
      console.log(`Error finding all seller listings: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findOne(id: any) {
    try {
      const listing = await this.sellerListingModel
        .findOne({
          _id: new Types.ObjectId(id)
        })
        .populate('sellerId', 'firstName lastName email roles');
      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }
      listing.images = listing.images.map((image) => ({
        url: image.url
          ? `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`
          : '',
      })) as [{ url: string }];
      return new ApiResponse(200, listing, Msg.LISTING_FETCHED);
    } catch (error) {
      console.log(`Error finding seller listing: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
