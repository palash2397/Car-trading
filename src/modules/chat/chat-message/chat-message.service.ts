import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  ChatMessage,
  ChatMessageDocument,
} from './schemas/chat-message.schema';

import {
  Conversation,
  ConversationDocument,
} from '../conversation/schemas/conversation.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

// import { AwsService } from 'src/modules/aws/aws.service';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    // private awsService: AwsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: { conversationId: any; senderId: any; content: string }) {
    try {
      const conversation = await this.conversationModel.findOne({
        _id: data.conversationId,
        participants: data.senderId,
      });
      if (!conversation) {
        return new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
      }
      const chatData = await this.chatMessageModel.create({
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        messageType: 'text',
        readBy: [data.senderId],
      });

      this.eventEmitter.emit('chat.message.created', {
        conversationId: data.conversationId,
        message: chatData,
      });

      await this.conversationModel.findByIdAndUpdate(data.conversationId, {
        $set: { updatedAt: new Date() },
      });

      return chatData;
    } catch (error) {
      console.log(`Error creating chat message: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async getMessages(conversationId: string, page: number, limit: number) {
    try {
      const conversation =
        await this.conversationModel.findById(conversationId);
      if (!conversation) {
        return new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
      }
      const skip = (page - 1) * limit;

      const messages = await this.chatMessageModel
        .find({ conversationId: new Types.ObjectId(conversationId) })
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'firstName lastName email')
        .populate('readBy', 'firstName lastName email');

      if (!messages || messages.length === 0) {
        return new ApiResponse(404, [], Msg.MESSAGES_NOT_FOUND);
      }

      // for (const message of messages) {
      //   if (message.messageType === 'file') {
      //     const signedUrl = await this.awsService.getSignedFileUrl(
      //       message.fileUrl,
      //     );
      //     message.fileUrl = signedUrl;
      //     message.content = signedUrl;
      //   }
      // }
      return new ApiResponse(200, messages, Msg.CHAT_MESSAGE_FETCHED);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async getById(conversationId: string, userId: string) {
    try {
      const conversation = await this.conversationModel.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        return new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
      }

      return new ApiResponse(200, conversation, Msg.CHAT_MESSAGE_FETCHED);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markAsRead(messageId: string, userId: string) {
    try {
      await this.chatMessageModel.findByIdAndUpdate(messageId, {
        $addToSet: { readBy: new Types.ObjectId(userId) },
      });
    } catch (error) {
      console.log(`error while mark as read`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markAsDelivered(messageId: string, userId: string) {
    try {
      await this.chatMessageModel.findByIdAndUpdate(messageId, {
        $addToSet: { deliveredTo: new Types.ObjectId(userId) },
      });
    } catch (error) {
      console.log(`error while mark as delivered`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
  
  async markConversationAsRead(conversationId: string, userId: string) {
    try {
      const conversation = await this.conversationModel.findOne({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId),
      });

      if (!conversation) {
        return new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
      }

      await this.chatMessageModel.updateMany(
        {
          conversationId: new Types.ObjectId(conversationId),
          readBy: { $ne: new Types.ObjectId(userId) },
        },
        {
          $addToSet: { readBy: new Types.ObjectId(userId) },
        },
      );

      return new ApiResponse(200, {}, Msg.CONVERSATION_MARKED_AS_READ);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async createFileMessage(
  //   conversationId: string,
  //   file: Express.Multer.File,
  //   userId: string,
  // ) {
  //   try {
  //     const conversation =
  //       await this.conversationModel.findById(conversationId);
  //     if (!conversation) {
  //       return new ApiResponse(404, {}, Msg.CONVERSATION_NOT_FOUND);
  //     }

  //     const uploadResult = await this.awsService.uploadFile(
  //       `chat/conversation/${conversationId}/${Date.now()}-${file.originalname}`,
  //       file.buffer,
  //       file.mimetype,
  //     );

  //     const msgFile = await this.chatMessageModel.create({
  //       conversationId,
  //       senderId: new Types.ObjectId(userId),
  //       content: uploadResult.Location,
  //       readBy: [new Types.ObjectId(userId)],
  //       messageType: 'file',
  //       fileUrl: uploadResult.Location,
  //       fileName: file.originalname,
  //     });

  //     // console.log("Event emitted:", conversationId);

  //     const signedUrl = await this.awsService.getSignedFileUrl(msgFile.fileUrl);
  //     msgFile.fileUrl = signedUrl;
  //     msgFile.content = signedUrl;
  //     this.eventEmitter.emit('chat.message.created', {
  //       conversationId,
  //       message: msgFile,
  //     });

  //     return new ApiResponse(200, msgFile, Msg.CHAT_MESSAGE_CREATED);
  //   } catch (error) {
  //     console.log(`error while creating file message: ${error}`);
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }
}
