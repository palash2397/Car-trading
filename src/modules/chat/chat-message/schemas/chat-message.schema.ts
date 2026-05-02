import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User', default: [] }] })
  readBy: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  deliveredTo: Types.ObjectId[];

  
  @Prop({ default: 'text' })
  messageType: 'text' | 'file';

  @Prop()
  fileUrl: string;

  @Prop()
  fileName: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
