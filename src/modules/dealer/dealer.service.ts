import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Dealer, DealerDocument } from './schemas/dealer.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UpdateDealerDto } from './dto/update-dealer.dto';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { deleteOldFile } from 'src/utils/helpers';

@Injectable()
export class DealerService {
  constructor(
    @InjectModel(Dealer.name) private dealerModel: Model<DealerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateDealerDto,
    file: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const dealer = await this.dealerModel.findOneAndUpdate(
        { user: user._id },
        { ...dto, user: user._id, avatar: file?.filename },
        { new: true, upsert: true },
      );
      console.log(dealer);
      if (!dealer) {
        return new ApiResponse(404, {}, Msg.DEALER_NOT_FOUND);
      }

      if (file) {
        if (dealer.avatar) {
          deleteOldFile(dealer.avatar);
        }

        dealer.avatar = file.filename;
        await dealer.save();
      }

      return new ApiResponse(200, dealer, Msg.DEALER_UPDATED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async Profile(userId: string) {
    try {
      const dealer = await this.dealerModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user');
      if (!dealer) {
        return new ApiResponse(404, {}, Msg.DEALER_NOT_FOUND);
      }

      dealer.avatar = dealer.avatar
        ? `${process.env.BASE_URL}/uploads/dealer/${dealer.avatar}`
        : '';
      return new ApiResponse(200, dealer, Msg.SELLER_PROFILE_FETCHED);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
