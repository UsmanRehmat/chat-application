import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entity/room.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JoinRoomDto } from './dto/join-room.dto';
import { MessageEntity } from 'src/message/entity/message.entity';

@Controller('room')
export class RoomController {

    constructor(private readonly roomService: RoomService){}

    @ApiBearerAuth()
    @Post()
    async create(@Body() createRoomDto: CreateRoomDto, @Req() request): Promise<RoomEntity> {
        return this.roomService.createRoom(createRoomDto, request.user);
    }

    @ApiBearerAuth()
    @Post('/join')
    async joinRoom(@Body() joinRoomDto: JoinRoomDto, @Req() request): Promise<MessageEntity[]> {
      return this.roomService.addUserToRoom(joinRoomDto.roomId, request?.user?.id);
    }

    @ApiBearerAuth()
    @Get()
    async getAllRooms(): Promise<RoomEntity[]> {
      return this.roomService.getAllRooms();
    }

    @ApiBearerAuth()
    @Get('/user')
    async getUserRooms(@Req() request): Promise<RoomEntity[]> {
      return this.roomService.getRoomsByUserId(request?.user?.id);
    }

}
