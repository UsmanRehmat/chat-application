import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    Logger.log('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    Logger.log('Method not implemented.');
  }
  handleDisconnect(client: any) {
    Logger.log('Method not implemented.');
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return 'Hello world!';
  }
}
