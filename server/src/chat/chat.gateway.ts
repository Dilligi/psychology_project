import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Server, Socket } from 'Socket.IO';
import { MessageUpdatePayload } from '../types';
import { CLIENT_URI } from '../../constants';
import { ChatService } from './chat.service';

const users: Record<string, string> = {};

@WebSocketGateway({
  cors: {
    origin: CLIENT_URI // можно указать `*` для отключения `CORS`
  },
  serveClient: false,
  // название пространства может быть любым, но должно учитываться на клиенте
  namespace: 'chat'
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(server);
  }

  // подключение
  handleConnection(client: Socket /*, ...args: any[]*/) {
    // обратите внимание на структуру объекта `handshake`
    const userName = client.handshake.query.userName as string;
    const socketId = client.id;
    users[socketId] = userName;

    // передаем информацию всем клиентам, кроме текущего
    client.broadcast.emit('log', `${userName} connected`);
  }

  // отключение
  handleDisconnect(client: Socket) {
    const socketId = client.id;
    const userName = users[socketId];
    delete users[socketId];

    client.broadcast.emit('log', `${userName} disconnected`);
  }

  // получение всех сообщений
  @SubscribeMessage('messages:get')
  async handleMessagesGet(): Promise<void> {
    const messages = await this.chatService.getMessages();
    this.server.emit('messages', messages);
  }

  // удаление всех сообщений
  @SubscribeMessage('messages:clear')
  async handleMessagesClear(): Promise<void> {
    await this.chatService.clearMessages();
  }

  // создание сообщения
  @SubscribeMessage('message:post')
  async handleMessagePost(
    @MessageBody()
    payload: // { userId: string, userName: string, text: string }
    Prisma.MessageCreateInput
  ): Promise<void> {
    const createdMessage = await this.chatService.createMessage(payload);
    // можно сообщать клиентам о каждой операции по отдельности
    this.server.emit('message:post', createdMessage);
    // но мы пойдем более простым путем
    this.handleMessagesGet();
  }

  // обновление сообщения
  @SubscribeMessage('message:put')
  async handleMessagePut(
    @MessageBody()
    payload: // { id: number, text: string }
    MessageUpdatePayload
  ): Promise<void> {
    const updatedMessage = await this.chatService.updateMessage(payload);
    this.server.emit('message:put', updatedMessage);
    this.handleMessagesGet();
  }

  // удаление сообщения
  @SubscribeMessage('message:delete')
  async handleMessageDelete(
    @MessageBody()
    payload: // { id: number }
    Prisma.MessageWhereUniqueInput
  ) {
    const removedMessage = await this.chatService.removeMessage(payload);
    this.server.emit('message:delete', removedMessage);
    this.handleMessagesGet();
  }
}
