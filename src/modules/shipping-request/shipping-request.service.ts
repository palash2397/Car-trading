import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ShippingRequest,
  ShippingRequestDocument,
} from './schema/shipping-request.schema';
import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import { ShippingStatus } from 'src/common/enums/tower/shipping-status.enum';

import { CreateShippingRequestDto } from './dto/create-shipping-request.dto';
import { AssignShippingProviderDto } from './dto/assign-shipping-provider.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class ShippingRequestService {
  constructor(
    @InjectModel(ShippingRequest.name)
    private shippingRequestModel: Model<ShippingRequestDocument>,

    @InjectModel(SellerListing.name)
    private readonly sellerListingModel: Model<SellerListingDocument>,
  ) {}

  async createShippingRequest(buyerId: string, dto: CreateShippingRequestDto) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const request = await this.shippingRequestModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: listing.sellerId,
        deliveryAddress: dto.deliveryAddress,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipCode,
        buyerMessage: dto.buyerMessage || '',
        trackingHistory: [
          {
            status: ShippingStatus.PENDING,
            note: 'Shipping request created',
          },
        ],
      });

      return new ApiResponse(201, request, Msg.SHIPPING_REQUEST_CREATED);
    } catch (error) {
      console.log(`Error creating shipping request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerShippingRequests(sellerId: string) {
    try {
      const data = await this.shippingRequestModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching seller shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerShippingRequest(sellerId: string, requestId: string) {
    try {
      const data = await this.shippingRequestModel
        .findOne({
          sellerId: new Types.ObjectId(sellerId),
          _id: new Types.ObjectId(requestId),
        })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!data) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching seller shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerShippingRequests(buyerId: string) {
    try {
      const data = await this.shippingRequestModel
        .find({ buyerId: new Types.ObjectId(buyerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching seller shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerShippingRequest(buyerId: string, requestId: string) {
    try {
      const data = await this.shippingRequestModel
        .findOne({
          buyerId: new Types.ObjectId(buyerId),
          _id: new Types.ObjectId(requestId),
        })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!data) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching buyer shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async assignShippingProvider(
    sellerId: string,
    dto: AssignShippingProviderDto,
  ) {
    try {
      const data = await this.shippingRequestModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.requestId),
          sellerId: new Types.ObjectId(sellerId),
        },
        {
          shippingProviderId: new Types.ObjectId(dto.shippingProviderId),
          status: ShippingStatus.ASSIGNED,
          $push: {
            trackingHistory: {
              status: ShippingStatus.ASSIGNED,
              note: 'Shipping provider assigned',
            },
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!data) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(
        200,
        data,
        Msg.SHIPPING_PROVIDER_ASSIGNED_SUCCESSFULLY,
      );
    } catch (error) {
      console.log(`Error assigning shipping provider: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async towerShippingRequests(towerId: string) {
    try {
      const data = await this.shippingRequestModel
        .find({ shippingProviderId: new Types.ObjectId(towerId) })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName')
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching tower shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async towerShippingRequest(towerId: string, requestId: string) {
    try {
      const data = await this.shippingRequestModel
        .findOne({
          shippingProviderId: new Types.ObjectId(towerId),
          _id: new Types.ObjectId(requestId),
        })
        .populate('listingId', 'title price make model year images')
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .populate('shippingProviderId', 'firstName lastName')
        .sort({ createdAt: -1 });

      if (!data) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUESTS_FETCHED);
    } catch (error) {
      console.log(`Error fetching tower shipping requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateShippingStatus(providerId: string, dto: UpdateShippingStatusDto) {
    try {
      const updateData: any = {
        status: dto.status,
        $push: {
          trackingHistory: {
            status: dto.status,
            note: dto.note || '',
          },
        },
      };

      if (dto.trackingLabel) {
        updateData.trackingLabel = dto.trackingLabel;
      }

      if (dto.expectedDeliveryDate) {
        updateData.expectedDeliveryDate = dto.expectedDeliveryDate;
      }

      const data = await this.shippingRequestModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.requestId),
          shippingProviderId: new Types.ObjectId(providerId),
        },
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!data) {
        return new ApiResponse(404, {}, Msg.SHIPPING_REQUEST_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.SHIPPING_REQUEST_STATUS_UPDATED);
    } catch (error) {
      console.log(`Error updating shipping status: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
