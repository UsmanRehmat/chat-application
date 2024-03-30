import { Body, Controller, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entity/room.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('room')
export class RoomController {

    constructor(private readonly roomService: RoomService){}

    @ApiBearerAuth()
    @Post()
    async create(@Body() createRoomDto: CreateRoomDto, @Req() request): Promise<RoomEntity> {
        return this.roomService.createRoom(createRoomDto, request.user);
      }
}
