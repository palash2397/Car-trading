import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';

import { User, UserDocument } from '../../user/schemas/user.schema';
import {
  ChatMessage,
  ChatMessageDocument,
} from '../chat-message/schemas/chat-message.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateGroupDto } from './dto/create-group.dto';
import { ConversationListItem } from './dto/conversation-list.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
  ) {}

  async createDirect(userId: string, targetUserId: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(userId));

      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }
      const targetUser = await this.userModel.findById(
        new Types.ObjectId(targetUserId),
      );

      if (!targetUser) {
        return new ApiResponse(404, {}, Msg.TARGET_USER_NOT_FOUND);
      }

      const existing = await this.conversationModel.findOne({
      
        participants: { $all: [userId, targetUserId] },
        $expr: { $eq: [{ $size: '$participants' }, 2] },
      });

      console.log('existing', existing);

      if (existing)
        return new ApiResponse(200, existing, Msg.CHAT_ALREADY_EXIST);

      const conversationdoc = await this.conversationModel.create({
        participants: [userId, targetUserId],
        createdBy: userId,
      });

      return new ApiResponse(200, conversationdoc, Msg.CONVERSATION_CREATED);
    } catch (error) {
      console.log(`Error creating direct conversation: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }


  async myConversation(userId: string): Promise<ConversationListItem[]> {
    try {
      // const user = await this.userModel.findById(new Types.ObjectId(userId));
      const conversations = await this.conversationModel
        .find({
          participants: userId,
          deletedFor: { $ne: userId },
        })
        .populate('participants', 'firstName lastName email')
        // .sort({ createdAt: -1 })
        .sort({ updatedAt: -1 })

        .lean();

      const result: ConversationListItem[] = [];

      for (const conversation of conversations) {
        // console.log("conversation ---->", conversation);
        const lastMessage = await this.chatMessageModel
          .findOne({ conversationId: conversation._id })
          .sort({ createdAt: -1 })
          .lean();

        // console.log("lastMessage ---->", lastMessage);

        const unreadCount = await this.chatMessageModel.countDocuments({
          conversationId: conversation._id,
          readBy: { $ne: userId },
        });

        result.push({
          _id: conversation._id.toString(),
    
          participants: (conversation.participants as any[]).map((p) => ({
            _id: p._id.toString(),
            name: p.firstName + ' ' + p.lastName,
            email: p.email,
          })),
          // participants: conversation.participants.map((p: any) => p.toString()),
          lastMessage: lastMessage
            ? {
                ...lastMessage,
                _id: lastMessage._id.toString(),
              }
            : null,
          unreadCount,
        });
      }
      return result;

      // throw new ApiResponse(200, result, Msg.CONVERSATION_FETCHED);;
    } catch (error) {
      console.log(`Error fetching my conversation: ${error.message}`);
      throw new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async deleteConversation(conversationId: string, userId: string) {
    try {
      // console.log("conversationId ---->", conversationId);
      // console.log("userId ---->", userId);
      const consversation = await this.conversationModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(conversationId) },
        {
          $addToSet: { deletedFor: userId },
        },
      );

      if (!consversation) {
        throw new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
      }

      return new ApiResponse(200, { conversationId }, Msg.CONVERSATION_DELETED);
    } catch (error) {
      console.log(`error while deleting conversation: ${error.message}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async myConversation(userId: string) {
  //   try {
  //     const user = await this.userModel.findById(new Types.ObjectId(userId));

  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //     const conversations = await this.conversationModel
  //       .find({ participants: userId })
  //       .sort({ updatedAt: -1 })
  //       .lean();

  //     const result = {};

  //     for (const conversation of conversations) {
  //       const lastMessage = await this.chatMessageModel
  //         .findOne({ conversationId: conversation._id })
  //         .sort({ createdAt: -1 })
  //         .lean();

  //        console.log("lastMessage ---->", lastMessage);

  //       const unreadCount = await this.chatMessageModel.countDocuments({
  //         conversationId: conversation._id,
  //         readBy: { $ne: userId },
  //       });

  //     }

  //     return new ApiResponse(200, conversations, Msg.CONVERSATION_LIST_FETCHED);
  //   } catch (error) {
  //     console.log(`Error fetching my conversation: ${error.message}`);
  //     throw new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }

  async isParticipant(conversationId: string, userId: string) {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participants: userId,
    });

    return !!conversation;
  }
}
