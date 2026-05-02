import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tower, TowerDocument } from './schema/tower.schema';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { deleteOldFile } from 'src/utils/helpers';

import { UpdateTowerDto } from './dto/update-tower.dto';

@Injectable()
export class TowerService {
  constructor(
    @InjectModel(Tower.name) private towerModel: Model<TowerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateTowerDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const tower = await this.towerModel.findOneAndUpdate(
        { user: user._id },
        { ...dto, user: user._id },
        { new: true, upsert: true },
      );
      console.log(tower);
      if (!tower) {
        return new ApiResponse(404, {}, Msg.TOWER_NOT_FOUND);
      }

      if (file) {
        deleteOldFile('tower', tower.avatar);
        tower.avatar = file.filename;
      }

      await tower.save();

      return new ApiResponse(200, tower, Msg.TOWER_UPDATED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async Profile(userId: string) {
    try {
      const tower = await this.towerModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user');
      if (!tower) {
        return new ApiResponse(404, {}, Msg.TOWER_NOT_FOUND);
      }

      tower.avatar = tower.avatar
        ? `${process.env.BASE_URL}/uploads/tower/${tower.avatar}`
        : '';
      return new ApiResponse(200, tower, Msg.TOWER_PROFILE_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
