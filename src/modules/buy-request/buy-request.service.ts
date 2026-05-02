import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';
import { BuyRequest, BuyRequestDocument } from './schemas/buy-request.schema';
import { Buyer, BuyerDocument } from '../buyer/schema/buyer.schema';
import { Seller, SellerDocument } from '../seller/schema/seller.schema';

import { CreateBuyRequestDto } from './dto/create-buy-request.dto';
import { UpdateBuyRequestStatusDto } from './dto/update-buy-request-status.dto';

import { BuyRequestStatus } from 'src/common/enums/buyer/buy-request-status.enum';

@Injectable()
export class BuyerRequestService {
  constructor(
    @InjectModel(BuyRequest.name)
    private readonly buyRequestModel: Model<BuyRequestDocument>,
    @InjectModel(SellerListing.name)
    private readonly sellerListingModel: Model<SellerListingDocument>,
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<BuyerDocument>,
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
  ) {}

  async createBuyRequest(buyerId: string, dto: CreateBuyRequestDto) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const existingRequest = await this.buyRequestModel.findOne({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        status: {
          $in: [
            BuyRequestStatus.PENDING,
            BuyRequestStatus.ACCEPTED,
            BuyRequestStatus.IN_PROGRESS,
          ],
        },
      });

      if (existingRequest) {
        return new ApiResponse(400, {}, Msg.BUY_REQUEST_ALREADY_EXISTS);
      }

      const buyRequest = await this.buyRequestModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: listing.sellerId,
        buyMode: dto.buyMode,
        needDelivery: dto.needDelivery ?? false,
        needDetailing: dto.needDetailing ?? false,
        needProfessionalCheck: dto.needProfessionalCheck ?? false,
        useGuaranteedTransaction: dto.useGuaranteedTransaction ?? false,
        message: dto.message || '',
      });

      return new ApiResponse(201, buyRequest, Msg.BUY_REQUEST_CREATED);
    } catch (error) {
      console.log(`Error creating buy request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerBuyRequests(sellerId: string) {
    try {
      const requests = await this.buyRequestModel
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

  async sellerBuyRequest(sellerId: string, requestId: string) {
    try {
      const request = await this.buyRequestModel
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
        return new ApiResponse(404, {}, Msg.BUY_REQUEST_NOT_FOUND);
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

      return new ApiResponse(200, request, Msg.BUY_REQUEST_FETCHED);
    } catch (error) {
      console.log(`Error fetching buy request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateBuyRequestStatus(
    sellerId: string,
    requestId: string,
    dto: UpdateBuyRequestStatusDto,
  ) {
    try {
      const request = await this.buyRequestModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(requestId),
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
        return new ApiResponse(404, {}, Msg.BUY_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, request, Msg.BUY_REQUEST_UPDATED);
    } catch (error) {
      console.log(`Error updating buy request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerBuyRequests(buyerId: string) {
    try {
      const requests = await this.buyRequestModel
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
      return new ApiResponse(200, requests, Msg.BUY_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error sending buyer request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerBuyRequest(buyerId: string, id: string) {
    try {
      const request = await this.buyRequestModel
        .findOne({
          _id: new Types.ObjectId(id),
          buyerId: new Types.ObjectId(buyerId),
        })
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .populate('listingId', 'title price make model year images')
        .lean();

      if (!request) {
        return new ApiResponse(404, {}, Msg.BUY_REQUEST_NOT_FOUND);
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
      return new ApiResponse(200, request, Msg.BUY_REQUEST_FETCHED);
    } catch (error) {
      console.log(`Error sending seller request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerCancelRequest(buyerId: string, id: string) {
    try {
      const request = await this.buyRequestModel.findOne({
        _id: new Types.ObjectId(id),
        buyerId: new Types.ObjectId(buyerId),
      });

      if (!request) {
        return new ApiResponse(404, {}, Msg.BUYER_REQUEST_NOT_FOUND);
      }

      if (request.status == BuyRequestStatus.ACCEPTED) {
        return new ApiResponse(400, {}, Msg.BUYER_REQUEST_ALREADY_ACCEPTED);
      }

      request.status = BuyRequestStatus.CANCELLED;

      await request.save();

      return new ApiResponse(200, request, Msg.BUYER_CANCEL_REQUEST);
    } catch (error) {
      console.log(`Error while cancelling the buy request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async updateReserveRequestStatus(
  //     sellerId: string,
  //     dto: UpdateBuyRequestStatusDto,
  //   ) {
  //     try {
  //       const request = await this.reserveRequestModel.findOneAndUpdate(
  //         {
  //           _id: new Types.ObjectId(dto.requestId),
  //           sellerId: new Types.ObjectId(sellerId),
  //         },
  //         {
  //           status: dto.status,
  //           sellerReply: dto.sellerReply || '',
  //         },
  //         {
  //           new: true,
  //           runValidators: true,
  //         },
  //       );

  //       if (!request) {
  //         return new ApiResponse(404, {}, Msg.RESERVE_REQUEST_NOT_FOUND);
  //       }

  //       return new ApiResponse(200, request, Msg.RESERVE_REQUEST_UPDATED);
  //     } catch (error) {
  //       console.log(`Error updating reserve request: ${error}`);
  //       return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //     }
  //   }
}
