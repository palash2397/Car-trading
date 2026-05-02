import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

import { Types } from 'mongoose';

import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatMessageService } from './chat-message/chat-message.service';
import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private chatMessageService: ChatMessageService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

    
      this.onlineUsers.set(payload.id, client.id);

      this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));

      client.data.user = payload;
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;

    if (user?.id) {
      this.onlineUsers.delete(user.id);

      // Broadcast updated online users
      this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoin(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);

    console.log('Joining room:', conversationId);
   

    const room = this.server.sockets.adapter.rooms.get(conversationId);
    console.log('Room after join:', room);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = client.data.user;

      // console.log(user);

      const userDoc = await this.chatMessageService.create({
        conversationId: new Types.ObjectId(data.conversationId),
        senderId: new Types.ObjectId(user.id),
        content: data.content,
      });
      // console.log('userDoc ----------->', userDoc);

      return userDoc;
    } catch (error) {
      console.log(error);
    }
  }


  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;


    client.to(data.conversationId).emit('userTyping', {
      userId: user.id,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user;

    client.to(data.conversationId).emit('userStoppedTyping', {
      userId: user.id,
      conversationId: data.conversationId,
    });
  }

  // @OnEvent('chat.message.created')
  // handleMessageCreated(payload: any) {
  //   // console.log('Full payload:', payload);
  //   this.server
  //     .to(payload.conversationId.toString())
  //     .emit('receiveMessage', payload.message);
  // }

  @OnEvent('chat.message.created')
  async handleMessageCreated(payload: any) {
    // Emit new message to room
    this.server
      .to(payload.conversationId.toString())
      .emit('receiveMessage', payload.message);
  }

  // @SubscribeMessage('messageDelivered')
  // async handleDelivered(
  //   @MessageBody() data: { messageId: string; conversationId: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const user = client.data.user;

  //   await this.chatMessageService.markAsDelivered(data.messageId, user.id);

  //   this.server.to(data.conversationId).emit('messageDelivered', {
  //     messageId: data.messageId,
  //     userId: user.id,
  //   });
  // }



  // @SubscribeMessage('messageRead')
  // async handleRead(
  //   @MessageBody() data: { messageId: string; conversationId: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const user = client.data.user;
  //   await this.chatMessageService.markAsRead(data.messageId, user.id);

  //   this.server.to(data.conversationId).emit('messageRead', {
  //     messageId: data.messageId,
  //     userId: user.id,
  //   });
    
  //   return { success: true };
  // }
}
