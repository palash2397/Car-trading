import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from '../user/schemas/user.schema';
import {
  SellerListing,
  SellerListingDocument,
} from './schemas/seller-listing.schema';

import { CreateSellerListingDto } from './dto/create-seller-listing';
import { UpdateSellerListingDto } from './dto/update-seller-listing';
import { DeleteCarImagesDto } from './dto/delete-car-images';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';
import { deleteOldFile } from 'src/utils/helpers/index';

@Injectable()
export class SellerListingService {
  constructor(
    @InjectModel(SellerListing.name)
    private sellerListingModel: Model<SellerListingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    userId: any,
    dto: CreateSellerListingDto,
    files: Express.Multer.File[],
  ) {
    try {
      const existingListing = await this.sellerListingModel.findOne({
        sellerId: new Types.ObjectId(userId),
        title: dto.title,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        isActive: true,
        isSold: false,
      });

      if (existingListing) {
        return new ApiResponse(409, {}, Msg.LISTING_EXISTS);
      }

      const listing = await this.sellerListingModel.create({
        ...dto,
        sellerId: new Types.ObjectId(userId),
        images: files.map((file) => ({ url: file.filename })),
      });

      return new ApiResponse(201, listing, Msg.LISTED_SUCCESSFULLY);
    } catch (error) {
      console.log(`Error creating seller listing: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findAll(userId: any) {
    try {
      const listings = await this.sellerListingModel
        .find({ sellerId: new Types.ObjectId(userId) })
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

  async findOne(id: any, userId: any) {
    try {
      const listing = await this.sellerListingModel.findOne({
        _id: new Types.ObjectId(id),
        sellerId: new Types.ObjectId(userId),
      });
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

  async delete(id: any, userId: any) {
    try {
      const listing = await this.sellerListingModel.findOneAndDelete({
        _id: new Types.ObjectId(id),
        sellerId: new Types.ObjectId(userId),
      });
      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }
      listing.images.forEach((image) => {
        deleteOldFile('seller/listing', image.url);
      });
      return new ApiResponse(200, listing, Msg.LISTING_DELETED);
    } catch (error) {
      console.log(`Error deleting seller listing: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSellerListingDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const listing = await this.sellerListingModel.findOne({
        _id: new Types.ObjectId(id),
        sellerId: new Types.ObjectId(userId),
      });

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const updateData: any = { ...dto };

      if (files && files.length > 0) {
        const newImages = files.map((file) => ({
          url: file.filename,
        }));

        updateData.images = [...(listing.images || []), ...newImages];
      }

      const updatedListing = await this.sellerListingModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          sellerId: new Types.ObjectId(userId),
        },
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      return new ApiResponse(200, updatedListing, Msg.LISTING_UPDATED);
    } catch (error) {
      console.log(`Error updating seller listing: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async deleteListingImages(userId: string, dto: DeleteCarImagesDto) {
  //   try {
  //     const listing = await this.sellerListingModel.findOne({
  //       _id: new Types.ObjectId(dto.listingId),
  //       sellerId: new Types.ObjectId(userId),
  //     });

  //     if (!listing) {
  //       return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
  //     }

  //     listing.images = (listing.images || []).filter((img) => {
  //       console.log('image', img);
  //       return !dto.imageIds.includes(img.url);
  //     }) as [{ url: string }];

  //     await listing.save();

  //     return new ApiResponse(200, listing, Msg.LISTING_UPDATED);
  //   } catch (error) {
  //     console.log(`Error deleting seller listing images: ${error}`);
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }
}
