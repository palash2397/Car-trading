import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatMessageSchema, ChatMessage } from './schemas/chat-message.schema';
import { ConversationSchema, Conversation } from '../conversation/schemas/conversation.schema';
import { UserSchema, User } from 'src/modules/user/schemas/user.schema';

import { ConversationModule } from '../conversation/conversation.module';
// import { AwsModule } from 'src/modules/aws/aws.module';

@Module({
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
  imports: [
    ConversationModule,
    // AwsModule,
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [
    ChatMessageService,
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
  ],
})
export class ChatMessageModule {}
