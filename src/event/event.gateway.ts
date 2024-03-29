import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    return 'Hello world!';
  }
}
