import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import type { Request } from 'express';
import { IdParamDto } from './dto/id-param.dto';
import { CreateGroupDto } from './dto/create-group.dto';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Conversation')
@ApiBearerAuth('access-token')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/direct/:id')
  create(@Req() req: Request, @Param() params: IdParamDto) {
    return this.conversationService.createDirect(req.user!.id, params.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/group')
  // createGroup(@Req() req: Request, @Body() dto: CreateGroupDto) {
  //   return this.conversationService.createGroup(req.user!.id, dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  myConversations(@Req() req: Request) {
    return this.conversationService.myConversation(req.user!.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch("mark-as-read/:conversationId")
  // markAsRead(@Req() req: Request, @Param("conversationId") conversationId: string) {
  //   return this.conversationService.markConversationAsRead(conversationId, req.user.id);
  // }

  @Patch(':conversationId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteConversation(
    @Param('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    
    return this.conversationService.deleteConversation(
      conversationId,
      req.user!.id,
    );
  }
}
