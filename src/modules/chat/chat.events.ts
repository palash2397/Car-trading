import type { ChatMessageDocument } from './chat-message/schemas/chat-message.schema';

export const CHAT_MESSAGE_CREATED_EVENT = 'chat.message.created';

export type ChatMessageCreatedPayload = {
  conversationId: string;
  message: ChatMessageDocument;
  senderSocketId?: string;
};
