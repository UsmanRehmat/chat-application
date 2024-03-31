import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateMessageDto } from "../message/dto/create-message.dto";
import { MessageService } from "../message/message.service";
import { RoomService } from "../room/room.service";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/service/auth.service";
import { UpdateUserDto } from "../user/dto/update-user.dto";

@WebSocketGateway(3000, { transports: ["websocket"] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  async afterInit(server: any) {
    Logger.log("Websocket server started.");
    await this.userService.setAllUsersToInactive();
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      Logger.log("connection created");
      const decodedToken = await this.authService.verifyJwt(
        socket?.handshake?.headers?.authorization
      );
      const user = await this.userService.getUserById(decodedToken?.user?.id);
      if (!user) {
        socket.emit("No user found", new UnauthorizedException());
        socket.disconnect();
      } else {
        socket.data.user = user;
        const updateUser: UpdateUserDto = {
          id: user.id,
          socketId: socket.id,
          isLive: true,
        };
        await this.userService.updateUser(updateUser);
        const rooms = await this.roomService.getRoomsByUserId(user.id);
        return this.server.to(socket.id).emit("rooms", rooms);
      }
    } catch (error) {
      socket.emit("No user found", new NotFoundException());
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      Logger.log("connection disconnected");
    const user = await this.userService.getUserBySocketId(socket.id);
    if (!user) {
      socket.emit("Unauthorized", new UnauthorizedException());
      socket.disconnect();
    }
    const updateUserDto: UpdateUserDto = {
      id: user.id,
      socketId: "disconnected",
      isLive: false,
    };
    await this.userService.updateUser(updateUserDto);
    socket.disconnect();
    } catch (error) {
      socket.emit('Error', new UnauthorizedException());
      socket.disconnect();
    }
    
  }

  @SubscribeMessage("create-message")
  async handleCreateMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() socket: Socket
  ) {
    createMessageDto.user = socket.data.user;
    await this.messageService.createMessage(createMessageDto);
    const users = await this.userService.getLiveUsersByRoomId(
      createMessageDto.room.id
    );
    for (const user of users) {
      await this.server
        .to(user.socketId)
        .emit("create-message", createMessageDto.text);
    }
  }
}
