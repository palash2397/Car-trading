import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BidOfferType } from 'src/common/enums/bid/bid-offer-type.enum';
import { BidOfferStatus } from 'src/common/enums/bid/bid-offer-status.enum';


import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import { BidOffer, BidOfferDocument } from './schemas/bid-offer.schema';

import { Buyer, BuyerDocument } from '../buyer/schema/buyer.schema';
import { Seller, SellerDocument } from '../seller/schema/seller.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateBidOfferDto } from './dto/create-bid-offer.dto';
import { UpdateBidOfferStatusDto } from './dto/update-bid-offer-status.dto';

@Injectable()
export class BidOfferService {
  constructor(
    @InjectModel(SellerListing.name)
    private readonly sellerListingModel: Model<SellerListingDocument>,
    @InjectModel(BidOffer.name)
    private readonly bidOfferModel: Model<BidOfferDocument>,
    @InjectModel(Buyer.name)
    private readonly buyerModel: Model<BuyerDocument>,
    @InjectModel(Seller.name)
    private readonly sellerModel: Model<SellerDocument>,
  ) {}

  async createBidOffer(buyerId: string, dto: CreateBidOfferDto) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      if (dto.type === BidOfferType.BID && !listing.isAuction) {
        return new ApiResponse(400, {}, Msg.BID_OFFER_ONLY_FOR_AUCTION);
      }

      if (dto.type === BidOfferType.OFFER && listing.isAuction) {
        return new ApiResponse(400, {}, Msg.BID_OFFER_ONLY_FOR_NON_AUCTION);
      }

      if (dto.type === BidOfferType.BID) {
        const currentHighest = listing.currentBid || 0;

        console.log('currentHighest', currentHighest);
        console.log('dto.amount', dto.amount);
        if (dto.amount <= currentHighest) {
          return new ApiResponse(400, {}, Msg.BID_OFFER_MIN_AMOUNT);
        }
      }

      const bidOffer = await this.bidOfferModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: listing.sellerId,
        type: dto.type,
        amount: dto.amount,
        message: dto.message || '',
      });

      if (dto.type === BidOfferType.BID) {
        listing.currentBid = dto.amount;
        await listing.save();
      }

      return new ApiResponse(201, bidOffer, `${dto.type} created successfully`);
    } catch (error) {
      console.log(`Error creating bid/offer: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerBidOfferRequests(sellerId: string) {
    try {
      const requests = await this.bidOfferModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!requests || requests.length === 0) {
        return new ApiResponse(200, [], Msg.BID_OFFER_NOT_FOUND);
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

      return new ApiResponse(200, requests, Msg.BID_OFFER_FETCHED);
    } catch (error) {
      console.log(`Error fetching bid offers: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerBidOfferRequest(sellerId: string, requestId: string) {
    try {
      const request = await this.bidOfferModel
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

      return new ApiResponse(200, request, Msg.BID_OFFER_FETCHED);
    } catch (error) {
      console.log(`Error fetching bid offer: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateBidOfferStatus(sellerId: string, dto: UpdateBidOfferStatusDto) {
    try {
      const data = await this.bidOfferModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.id),
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

      if (!data) {
        return new ApiResponse(404, {}, Msg.BID_OFFER_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.BID_OFFER_UPDATED);
    } catch (error) {
      console.log(`Error updating bid/offer: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerBidOfferRequests(buyerId: string) {
    try {
      const requests = await this.bidOfferModel
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
      return new ApiResponse(200, requests, Msg.BID_OFFERS_FETCHED);
    } catch (error) {
      console.log(`Error fetching bid offers: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerBidOfferRequest(buyerId: string, id: string) {
    try {
      const request = await this.bidOfferModel
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
      return new ApiResponse(200, request, Msg.BID_OFFER_FETCHED);
    } catch (error) {
      console.log(`Error fetching bid offer: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
                        
  async buyerCancelRequest(buyerId: string, id: string) {
    try {
      const request = await this.bidOfferModel.findOne({
        _id: new Types.ObjectId(id),
        buyerId: new Types.ObjectId(buyerId),
      });
  
        if (!request) {
          return new ApiResponse(404, {}, Msg.BUYER_REQUEST_NOT_FOUND);
        }
  
        if (request.status == BidOfferStatus.ACCEPTED) {
          return new ApiResponse(400, {}, Msg.BUYER_REQUEST_ALREADY_ACCEPTED);
        }
  
        request.status = BidOfferStatus.CANCELLED;
  
        await request.save();
  
        return new ApiResponse(200, request, Msg.BUYER_CANCEL_REQUEST);
      } catch (error) {
        console.log(`Error while cancelling the bid or offer request: ${error}`);
        return new ApiResponse(500, {}, Msg.SERVER_ERROR);
      }
  }
}
