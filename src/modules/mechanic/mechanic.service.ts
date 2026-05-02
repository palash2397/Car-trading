import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mechanic, MechanicDocument } from './schemas/mechanic.schema';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';
import { deleteOldFile } from 'src/utils/helpers';

import { UpdateMechanicProfileDto } from './dto/update-mechanic.dto';

@Injectable()
export class MechanicService {
  constructor(
    @InjectModel(Mechanic.name)
    private mechanicModel: Model<MechanicDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateMechanicProfileDto,
    file: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const mechanic = await this.mechanicModel.findOneAndUpdate(
        { user: user._id },
        { ...dto, user: user._id },
        { new: true, upsert: true },
      );
      console.log(mechanic);
      if (!mechanic) {
        return new ApiResponse(404, {}, Msg.MECHANIC_NOT_FOUND);
      }

      if (file) {
        if (mechanic.avatar) {
          deleteOldFile(mechanic.avatar);
        }

        mechanic.avatar = file.filename;
        await mechanic.save();
      }

      return new ApiResponse(200, mechanic, Msg.MECHANIC_UPDATED);
    } catch (error) {
      console.error('Error updating mechanic profile:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async Profile(userId: string) {
    try {
      const mechanic = await this.mechanicModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user');

      console.log(mechanic);
      if (!mechanic) {
        return new ApiResponse(404, {}, Msg.MECHANIC_NOT_FOUND);
      }

      mechanic.avatar = mechanic.avatar
        ? `${process.env.BASE_URL}/uploads/mechanic/${mechanic.avatar}`
        : '';
      return new ApiResponse(200, mechanic, Msg.MECHANIC_PROFILE_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
