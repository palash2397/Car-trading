import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';

import {
  Conversation,
  ConversationSchema,
} from './conversation/schemas/conversation.schema';

import { JwtModule } from '@nestjs/jwt';

import { ConversationController } from './conversation/conversation.controller';
import { ChatMessageController } from './chat-message/chat-message.controller';

import {
  ChatMessage,
  ChatMessageSchema,
} from './chat-message/schemas/chat-message.schema';

import { ChatGateway } from './chat.gateway';
import { ConversationService } from './conversation/conversation.service';
import { ChatMessageService } from './chat-message/chat-message.service';
import { User, UserSchema } from '../user/schemas/user.schema';

// import {AwsModule} from '../aws/aws.module';


@Module({
  imports: [

    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    EventEmitterModule.forRoot()
  ],
  controllers:[ConversationController, ChatMessageController],
  providers: [ChatGateway, ConversationService, ChatMessageService],
  exports: [ConversationService, ChatMessageService]
})
export class ChatModule {}
