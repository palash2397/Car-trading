import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Patch,
  Req,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';

import { ConversationService } from '../conversation/conversation.service';
import { GetMessagesDto } from './dto/get-messages.dto';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import type { Request } from 'express';

import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat Message')
@ApiBearerAuth('access-token')
@Controller('chat-message')
@UseGuards(JwtAuthGuard)
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @Get('/message/:conversationId')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesDto,
    @Req() req: Request,
  ) {
    console.log('req.user', req.user!);
    const isAllowed = await this.conversationService.isParticipant(
      conversationId,
      req.user!.id,
    );

    if (!isAllowed) {
      return new ApiResponse(403, {}, Msg.FORBIDDEN);
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    return this.chatMessageService.getMessages(conversationId, page, limit);
  }

  @Patch('/message/read/:id')
  async markAsRead(@Param('id') messageId: string, @Req() req: Request) {
    return this.chatMessageService.markAsRead(messageId, req.user!.id);
  }

  @Patch('/conversation/read/:id')
  async markAllAsRead(
    @Param('id') conversationId: string,
    @Req() req: Request,
  ) {
    return this.chatMessageService.markConversationAsRead(
      conversationId,
      req.user!.id,
    );
  }

  // @Post('/message/file/:id')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @Param('id') conversationId: string,
  //   @Req() req: Request,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {

  //   console.log('file', file);
  //   return this.chatMessageService.createFileMessage(
  //     conversationId,
  //     file,
  //     req.user!.id,
  //   );
  // }
}
