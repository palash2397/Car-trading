import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';
import {
  ReserveRequest,
  ReserveRequestDocument,
} from './schema/reserve-request.schema';

import { Buyer, BuyerDocument } from '../buyer/schema/buyer.schema';
import { Seller, SellerDocument } from '../seller/schema/seller.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateReserveRequestDto } from './dto/create-reserve-request.dto';
import { UpdateReserveRequestStatusDto } from './dto/update-reserve-request-status.dto';

import { ReserveRequestStatus } from 'src/common/enums/seller/reserve-request-status.enum';

@Injectable()
export class ReserveRequestService {
  constructor(
    @InjectModel(SellerListing.name)
    private readonly sellerListingModel: Model<SellerListingDocument>,
    @InjectModel(ReserveRequest.name)
    private readonly reserveRequestModel: Model<ReserveRequestDocument>,
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<BuyerDocument>,
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
  ) {}

  async createReserveRequest(buyerId: string, dto: CreateReserveRequestDto) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const existingActiveReserve = await this.reserveRequestModel.findOne({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        status: {
          $in: [ReserveRequestStatus.PENDING, ReserveRequestStatus.ACCEPTED],
        },
      });

      if (existingActiveReserve) {
        return new ApiResponse(400, {}, Msg.RESERVE_REQUEST_ALREADY_EXISTS);
      }

      const reserveUntil = new Date();
      reserveUntil.setDate(reserveUntil.getDate() + 1);

      const reserveRequest = await this.reserveRequestModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: listing.sellerId,
        message: dto.message || '',
        allowContactByEmail: dto.allowContactByEmail ?? true,
        allowContactByPhone: dto.allowContactByPhone ?? false,
        reserveUntil,
      });

      return new ApiResponse(201, reserveRequest, Msg.RESERVE_REQUEST_CREATED);
    } catch (error) {
      console.log(`Error creating reserve request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerReserveRequests(sellerId: string) {
    try {
      const requests = await this.reserveRequestModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!requests || requests.length === 0) {
        return new ApiResponse(200, [], Msg.RESERVE_REQUESTS_NOT_FOUND);
      }

      for (const request of requests as any[]) {
        const buyerProfile = await this.buyerModel
          .findOne({ user: new Types.ObjectId(request.buyerId._id) })
          .select('avatar')
          .lean();

        if (buyerProfile?.avatar) {
          request.buyerId.avatar = `${process.env.BASE_URL}/uploads/buyer/${buyerProfile.avatar}`;
        } else {
          request.buyerId.avatar = null;
        }

        // if (request.listingId?.images?.length) {
        //   request.listingId.images = request.listingId.images.map(
        //     (image: any) => ({
        //       ...image,
        //       url: `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`,
        //     }),
        //   );
        // }

        if (request.listingId?.images?.length) {
          request.listingId.images = request.listingId.images.map(
            (image: any) => ({
              ...image,
              url: `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`,
            }),
          );
        }
      }

      return new ApiResponse(200, requests, Msg.RESERVE_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching reserve requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerReserveRequest(sellerId: string, requestId: string) {
    try {
      const request = await this.reserveRequestModel
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
        return new ApiResponse(404, {}, Msg.RESERVE_REQUEST_NOT_FOUND);
      }

      const buyerData = request.buyerId as any;
      const listingData = request.listingId as any;

      const buyerProfile = await this.buyerModel
        .findOne({ user: buyerData._id })
        .select('avatar')
        .lean();

      buyerData.avatar = buyerProfile?.avatar
        ? `${process.env.BASE_URL}/uploads/buyer/${buyerProfile.avatar}`
        : null;

      if (listingData?.images?.length) {
        listingData.images = listingData.images.map((image: any) => ({
          ...image,
          url: `${process.env.BASE_URL}/uploads/seller/listing/${image.url}`,
        }));
      }

      return new ApiResponse(200, request, Msg.RESERVE_REQUEST_FETCHED);
    } catch (error) {
      console.log(`Error fetching reserve request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateReserveRequestStatus(
    sellerId: string,
    dto: UpdateReserveRequestStatusDto,
  ) {
    try {
      const request = await this.reserveRequestModel.findOneAndUpdate(
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
        return new ApiResponse(404, {}, Msg.RESERVE_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, request, Msg.RESERVE_REQUEST_UPDATED);
    } catch (error) {
      console.log(`Error updating reserve request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerRequests(buyerId: string) {
    try {
      const requests = await this.reserveRequestModel
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
      const request = await this.reserveRequestModel
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
      const request = await this.reserveRequestModel.findOne({
        _id: new Types.ObjectId(id),
        buyerId: new Types.ObjectId(buyerId),
      });

      if (!request) {
        return new ApiResponse(404, {}, Msg.BUYER_REQUEST_NOT_FOUND);
      }

      if (request.status == ReserveRequestStatus.ACCEPTED) {
        return new ApiResponse(400, {}, Msg.BUYER_REQUEST_ALREADY_ACCEPTED);
      }

      request.status = ReserveRequestStatus.CANCELLED;

      await request.save();

      return new ApiResponse(200, request, Msg.BUYER_CANCEL_REQUEST);
    } catch (error) {
      console.log(`Error sending seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
