import { Body, Controller, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomEntity } from './entity/room.entity';

@Controller('room')
export class RoomController {

    constructor(private readonly roomService: RoomService){}

    @Post()
    async create(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        return this.roomService.createRoom(createRoomDto);
      }
}
