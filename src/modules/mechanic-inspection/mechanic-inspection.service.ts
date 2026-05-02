import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  MechanicInspection,
  MechanicInspectionDocument,
} from './schemas/mechanic-inspection.schema';

import {
  SellerListing,
  SellerListingDocument,
} from '../seller-listing/schemas/seller-listing.schema';

import {
  Mechanic,
  MechanicDocument,
} from '../mechanic/schemas/mechanic.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateMechanicInspectionDto } from './dto/create-mechanic-inspection.dto';
import { UpdateMechanicInspectionStatusDto } from './dto/update-mechanic-inspection-status.dto';
import { AssignMechanicDto } from './dto/assign-mechanic.dto';
import { SubmitMechanicReportDto } from './dto/submit-mechanic-report.dto';

import { MechanicInspectionStatus } from 'src/common/enums/mechanic/mechanic-inspection-status.enum';

@Injectable()
export class MechanicInspectionService {
  constructor(
    @InjectModel(MechanicInspection.name)
    private mechanicInspectionModel: Model<MechanicInspectionDocument>,
    @InjectModel(Mechanic.name) private mechanicModel: Model<MechanicDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(SellerListing.name)
    private sellerListingModel: Model<SellerListingDocument>,
  ) {}

  async createInspectionRequest(
    buyerId: string,
    dto: CreateMechanicInspectionDto,
  ) {
    try {
      const listing = await this.sellerListingModel.findById(dto.listingId);

      if (!listing) {
        return new ApiResponse(404, {}, Msg.LISTING_NOT_FOUND);
      }

      const inspection = await this.mechanicInspectionModel.create({
        listingId: new Types.ObjectId(dto.listingId),
        buyerId: new Types.ObjectId(buyerId),
        sellerId: listing.sellerId,
        buyerMessage: dto.buyerMessage || '',
      });

      return new ApiResponse(201, inspection, Msg.MECHANIC_INSPECTION_CREATED);
    } catch (error) {
      console.log(`Error creating mechanic inspection request: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async sellerInspectionRequests(sellerId: string) {
    try {
      const inspections = await this.mechanicInspectionModel
        .find({
          sellerId: new Types.ObjectId(sellerId),
        })
        .populate('buyerId', 'firstName lastName email')
        .populate('listingId', 'title price make model year');

      if (!inspections || inspections.length === 0) {
        return new ApiResponse(404, {}, Msg.MECHANIC_INSPECTIONS_NOT_FOUND);
      }

      return new ApiResponse(
        200,
        inspections,
        Msg.MECHANIC_INSPECTIONS_FETCHED,
      );
    } catch (error) {
      console.log(`Error fetching mechanic inspection requests: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async buyerInspectionRequests(buyerId: string) {
    try {
      const inspections = await this.mechanicInspectionModel
        .find({
          buyerId: new Types.ObjectId(buyerId),
        })
        .populate('sellerId', 'firstName lastName email')
        .populate('listingId', 'title price make model year');

      if (!inspections || inspections.length === 0) {
        return new ApiResponse(404, {}, Msg.MECHANIC_INSPECTIONS_NOT_FOUND);
      }

      // inspections.forEach((inspection) => {
      //   inspection.listingId.images = inspection.listingId.images?.map((image) => {
      //     return `${process.env.BACKEND_URL}/${image}`;
      //   });
      // });

      return new ApiResponse(
        200,
        inspections,
        Msg.MECHANIC_INSPECTIONS_FETCHED,
      );
    } catch (error) {
      console.log(
        `Error fetching buyer mechanic inspection requests: ${error}`,
      );
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async assignMechanic(sellerId: string, dto: AssignMechanicDto) {
    try {
      const data = await this.mechanicInspectionModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.inspectionId),
          sellerId: new Types.ObjectId(sellerId),
        },
        {
          mechanicId: new Types.ObjectId(dto.mechanicId),
          status: MechanicInspectionStatus.ASSIGNED,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!data) {
        return new ApiResponse(404, {}, Msg.INSPECTION_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.MECHANIC_INSPECTION_UPDATED);
    } catch (error) {
      console.log(`Error assigning mechanic: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async mechanicInspectionsRequests(mechanicId: string) {
    try {
      const data = await this.mechanicInspectionModel
        .find({ mechanicId: new Types.ObjectId(mechanicId) })
        .populate('listingId', 'title price make model year')
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.MECHANIC_INSPECTIONS_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.MECHANIC_INSPECTIONS_FETCHED);
    } catch (error) {
      console.log(`Error fetching mechanic inspections: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async updateInspectionStatus(
    mechanicId: string,
    dto: UpdateMechanicInspectionStatusDto,
  ) {
    try {
      const data = await this.mechanicInspectionModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.inspectionId),
          mechanicId: new Types.ObjectId(mechanicId),
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
        return new ApiResponse(404, {}, Msg.INSPECTION_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.INSPECTION_UPDATED);
    } catch (error) {
      console.log(`Error updating inspection status: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async submitMechanicReport(mechanicId: string, dto: SubmitMechanicReportDto) {
    try {
      const data = await this.mechanicInspectionModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(dto.inspectionId),
          mechanicId: new Types.ObjectId(mechanicId),
        },
        {
          mechanicReport: dto.mechanicReport,
          overallCondition: dto.overallCondition || '',
          rating: dto.rating ?? 0,
          status: MechanicInspectionStatus.COMPLETED,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!data) {
        return new ApiResponse(404, {}, Msg.INSPECTION_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.MECHANIC_REPORT_SUBMITTED);
    } catch (error) {
      console.log(`Error submitting mechanic report: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
