import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entity/room.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JoinRoomDto } from './dto/join-room.dto';
import { MessageEntity } from '../message/entity/message.entity';

@Controller('room')
export class RoomController {

    logger = new Logger(RoomController.name);
    constructor(private readonly roomService: RoomService){}

    @ApiBearerAuth()
    @Post()
    async create(@Body() createRoomDto: CreateRoomDto, @Req() request): Promise<RoomEntity> {
        this.logger.debug('create');
        return this.roomService.createRoom(createRoomDto, request.user);
    }

    @ApiBearerAuth()
    @Post('/join')
    async joinRoom(@Body() joinRoomDto: JoinRoomDto, @Req() request): Promise<MessageEntity[]> {
      this.logger.debug('joinRoom');
      return this.roomService.addUserToRoom(joinRoomDto.roomId, request?.user?.id);
    }

    @ApiBearerAuth()
    @Get()
    async getAllRooms(): Promise<RoomEntity[]> {
      this.logger.debug('getAllRooms');
      return this.roomService.getAllRooms();
    }

    @ApiBearerAuth()
    @Get('/user')
    async getUserRooms(@Req() request): Promise<RoomEntity[]> {
      this.logger.debug('getUserRooms');
      return this.roomService.getRoomsByUserId(request?.user?.id);
    }

}
