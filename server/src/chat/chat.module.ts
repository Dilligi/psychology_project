import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// !
import { PrismaService } from '../prisma.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers: [ChatController],
  // !
  providers: [PrismaService, ChatService, ChatGateway]
})
export class ChatModule {}
