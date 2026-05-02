import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  SellerRequest,
  SellerRequestDocument,
} from './schema/seller-request.schema';

import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import { Seller, SellerDocument } from '../seller/schema/seller.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateSellerRequestDto } from './dto/create-seller-request.dto';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';


import { SellerRequestStatus } from 'src/common/enums/seller/seller-request-status.enum';


@Injectable()
export class SellerRequestService {
  constructor(
    @InjectModel(SellerRequest.name)
    private sellerRequestModel: Model<SellerRequestDocument>,
    @InjectModel(SellerListing.name)
    private sellerListingModel: Model<SellerListingDocument>,

    @InjectModel(Seller.name)
    private sellerModel: Model<SellerDocument>,
  ) {}

  async createRequest(buyerId: string, dto: CreateSellerRequestDto) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const request = await this.sellerRequestModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: new Types.ObjectId(listing.sellerId),
        requestType: dto.requestType,
        message: dto.message || '',
      });

      return new ApiResponse(201, request, Msg.SELLER_REQUEST_CREATED);
    } catch (error) {
      console.log(`Error creating seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerRequests(buyerId: string) {
    try {
      const requests = await this.sellerRequestModel
        .find({
          buyerId: new Types.ObjectId(buyerId),
        })
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .populate('listingId', 'title price make model year images')
        .lean();

      if (!requests || requests.length === 0) {
        return new ApiResponse(404, {}, Msg.SELLER_REQUEST_NOT_FOUND);
      }

      for (const request of requests as any[]) {
        const sellerProfile = await this.sellerModel
          .findOne({ user: request.sellerId._id })
          .select('avatar')
          .lean();

        if (sellerProfile?.avatar) {
          request.sellerId.avatar = `${process.env.BASE_URL}/uploads/seller/${sellerProfile.avatar}`;
        } else {
          request.sellerId.avatar = null;
        }

        if (request.listingId?.images?.length) {
          request.listingId.images = request.listingId.images.map(
            (image: any) => ({
              ...image,
              url: `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`,
            }),
          );
        }
      }
      return new ApiResponse(200, requests, Msg.SELLER_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error sending seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerRequest(buyerId: string, id: string) {
    try {
      const request = await this.sellerRequestModel
        .findOne({
          _id: new Types.ObjectId(id),
          buyerId: new Types.ObjectId(buyerId),
        })
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .populate('listingId', 'title price make model year images')
        .lean();

      if (!request) {
        return new ApiResponse(404, {}, Msg.SELLER_REQUEST_NOT_FOUND);
      }

      const sellerData = request.sellerId as any;
      const listingData = request.listingId as any;

      const sellerProfile = await this.sellerModel
        .findOne({ user: sellerData._id })
        .select('avatar')
        .lean();

      sellerData.avatar = sellerProfile?.avatar
        ? `${process.env.BASE_URL}/uploads/seller/${sellerProfile.avatar}`
        : null;

      if (listingData?.images?.length) {
        listingData.images = listingData.images.map((image: any) => ({
          ...image,
          url: `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`,
        }));
      }
      return new ApiResponse(200, request, Msg.SELLER_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error sending seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerCancelRequest(buyerId: string, id: string) {
    try {
      const request = await this.sellerRequestModel.findOne({
        _id: new Types.ObjectId(id),
        buyerId: new Types.ObjectId(buyerId),
      });

      if (!request ) {
        return new ApiResponse(404, {}, Msg.BUYER_REQUEST_NOT_FOUND);
      }

      if (request.status == SellerRequestStatus.ACCEPTED) {
        return new ApiResponse(400, {}, Msg.BUYER_REQUEST_ALREADY_ACCEPTED);
      }

      request.status = SellerRequestStatus.CANCELLED;

      await request.save();

      return new ApiResponse(200, request, Msg.BUYER_CANCEL_REQUEST);
    } catch (error) {
      console.log(`Error sending seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerRequests(sellerId: string) {
    try {
      const requests = await this.sellerRequestModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!requests || requests.length === 0) {
        return new ApiResponse(404, {}, Msg.SELLER_REQUESTS_NOT_FOUND);
      }
      requests.map((request) => {
        (request.listingId as any).images = (
          request.listingId as any
        ).images.map((image: any) => {
          image.url = `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`;
          return image;
        });
      });

      return new ApiResponse(200, requests, Msg.SELLER_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching seller requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerRequest(sellerId: string, requestId: string) {
    try {
      const request = await this.sellerRequestModel
        .findOne({
          _id: new Types.ObjectId(requestId),
          sellerId: new Types.ObjectId(sellerId),
        })
        .populate(
          'listingId',
          'title price make model year images sellerComments',
        )
        .populate('buyerId', 'firstName lastName email');

      if (!request) {
        return new ApiResponse(404, {}, Msg.SELLER_REQUEST_NOT_FOUND);
      }

      (request.listingId as any).images = (request.listingId as any).images.map(
        (image: any) => {
          image.url = `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`;
          return image;
        },
      );

      return new ApiResponse(200, request, Msg.SELLER_REQUEST_FETCHED);
    } catch (error) {
      console.log(`Error fetching seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateRequestStatus(
    sellerId: string,
    dto: UpdateSellerRequestStatusDto,
  ) {
    try {
      const request = await this.sellerRequestModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.requestId),
          sellerId: new Types.ObjectId(sellerId),
        },
        {
          status: dto.status,
          sellerReply: dto.sellerReply || '',
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!request) {
        return new ApiResponse(404, {}, Msg.SELLER_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, request, Msg.SELLER_REQUEST_UPDATED);
    } catch (error) {
      console.log(`Error updating seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
