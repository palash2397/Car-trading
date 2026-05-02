import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Seller, SellerDocument } from './schema/seller.schema';
import {
  Mechanic,
  MechanicDocument,
} from '../mechanic/schemas/mechanic.schema';
import { Tower, TowerDocument } from '../tower/schema/tower.schema';

import { UpdateProfileDto } from './dto/update-profile.dto';

import { Role } from 'src/common/enums/user/role.enum';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { deleteOldFile } from 'src/utils/helpers';
import console from 'console';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Seller.name) private sellerModel: Model<SellerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Mechanic.name) private mechanicModel: Model<MechanicDocument>,
    @InjectModel(Tower.name) private towerModel: Model<TowerDocument>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const seller = await this.sellerModel.findOneAndUpdate(
        { user: user._id },
        { ...dto, user: user._id },
        { new: true, upsert: true },
      );

      if (!seller) {
        return new ApiResponse(404, {}, Msg.SELLER_NOT_FOUND);
      }

      console.log(`seller ----------->`, seller);

      if (file) {
        if (seller.avatar) {
          deleteOldFile('seller', seller.avatar);
        }

        seller.avatar = file.filename;
        await seller.save();
      }

      return new ApiResponse(200, seller, Msg.SELLER_UPDATED);
    } catch (error) {
      console.log('Error updating seller profile:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async Profile(userId: string) {
    try {
      const seller = await this.sellerModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user');
      if (!seller) {
        return new ApiResponse(404, {}, Msg.SELLER_NOT_FOUND);
      }

      seller.avatar = seller.avatar
        ? `${process.env.BASE_URL}/uploads/seller/${seller.avatar}`
        : '';
      return new ApiResponse(200, seller, Msg.SELLER_PROFILE_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async allMechanics() {
    try {
      const mechanics = await this.userModel.find({ roles: Role.MECHANIC });
      console.log(mechanics);
      if (!mechanics || mechanics.length === 0) {
        return new ApiResponse(404, {}, Msg.MECHANICS_NOT_FOUND);
      }

      return new ApiResponse(200, mechanics, Msg.MECHANICS_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async mechanicById(mechanicId: string) {
    try {
      const user = await this.userModel.findById(mechanicId);

      if (!user) {
        return new ApiResponse(404, {}, Msg.MECHANIC_NOT_FOUND);
      }

      const mechanic = await this.mechanicModel.findOne({ user: user._id });

      let obj = {
        ...user.toObject(),
        ...mechanic?.toObject(),
        avatar: mechanic?.avatar
          ? `${process.env.BASE_URL}/uploads/mechanic/${mechanic.avatar}`
          : '',
      };

      return new ApiResponse(200, obj, Msg.MECHANIC_FETCHED);
    } catch (error) {
      console.log('Error fetching mechanic by ID:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async allTowers() {
    try {
      const towers = await this.userModel.find({ roles: Role.TOWER });
      console.log(towers);
      if (!towers || towers.length === 0) {
        return new ApiResponse(404, {}, Msg.TOWER_NOT_FOUND);
      }

      return new ApiResponse(200, towers, Msg.TOWERS_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async towerById(towerId: string) {
    try {
      const user = await this.userModel.findById(towerId);

      if (!user) {
        return new ApiResponse(404, {}, Msg.TOWER_NOT_FOUND);
      }

      const tower = await this.towerModel.findOne({ user: user._id });

      let obj = {
        ...user.toObject(),
        ...tower?.toObject(),
        avatar: tower?.avatar
          ? `${process.env.BASE_URL}/uploads/tower/${tower.avatar}`
          : '',
      };

      return new ApiResponse(200, obj, Msg.TOWER_PROFILE_FETCHED);
    } catch (error) {
      console.log('Error fetching tower by ID:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
