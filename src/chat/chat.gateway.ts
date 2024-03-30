import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { StringToObjectPipe } from './pipes/string-to-object.pipe';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@WebSocketGateway(3000, { transports: ['websocket']})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly authService: AuthService) {}

  afterInit(server: any) {
    Logger.log('Method not implemented.');
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    Logger.log('connection created');
    const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
    const user = await this.userService.getUserById(decodedToken.user.id);
    if (!user) {
      socket.emit('Error', new UnauthorizedException());
      socket.disconnect();
    } else {
      socket.data.user = user;
      const updateUser: UpdateUserDto = {
        id: user.id,
        socketId: socket.id,
        isLive: true;
      };
      await this.userService.updateUser(updateUser);
      const rooms = await this.roomService.getRoomsByUserId(user.id);
      return this.server.to(socket.id).emit('rooms', rooms);
    }

  }

  handleDisconnect(client: any) {
    Logger.log('Method not implemented.');
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, @MessageBody() createMessageDto: CreateMessageDto): Promise<CreateMessageDto> {
    return createMessageDto;
  }

  @SubscribeMessage('create-message')
  async handleCreateMessage(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    await this.messageService.createMessage(createMessageDto);
    const users = await this.userService.getLiveUsersByRoomId(createMessageDto.room.id);
    for (const user of users) {
      await this.server.to(user.socketId).emit('create-message', createMessageDto);
    }
  }

}
