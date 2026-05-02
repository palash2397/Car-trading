import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, UserDocument } from './schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    console.log('dto', dto);
    try {
      const userData = await this.userModel.findOne({ email: dto.email });
      if (userData) {
        return new ApiResponse(400, {}, Msg.INVALID_CREDENTIALS);
      }

      const user = new this.userModel(dto);
      await user.save();

      return new ApiResponse(201, {}, Msg.USER_REGISTER);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const userData = await this.userModel
        .findOne({ email: dto.email })
        .select('+password');
      if (!userData) {
        return new ApiResponse(400, {}, Msg.INVALID_CREDENTIALS);
      }

      const isPasswordValid = await bcrypt.compare(dto.password, userData.password);
      // console.log('isPasswordValid', isPasswordValid);
      if (!isPasswordValid) {
        return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      }

      const token = jwt.sign(
        { id: userData._id, roles: userData.roles },
        process.env.JWT_SECRET!,
        {
          expiresIn: '10d',
        },
      );

      const userDataResponse = {
        _id: userData._id,
        name: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        roles: userData.roles,
        token,
      };

      return new ApiResponse(200, userDataResponse, Msg.LOGIN_SUCCESS);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }


  // async profile(userId: string) {
  //   try {
  //     const user = await this.userModel.findById(userId);
  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //     return new ApiResponse(200, user, Msg.USER_FETCHED);
  //   } catch (error) {
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }

  // async updateProfile(userId: string, dto: UpdateUserDto) {
  //   try {
  //     const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });
  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //     return new ApiResponse(200, user, Msg.USER_UPDATED);
  //   } catch (error) {
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }
}
