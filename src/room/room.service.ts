import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomEntity } from './entity/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class RoomService {
    constructor(@InjectRepository(RoomEntity) private readonly roomRepository: Repository<RoomEntity>) {}
    async createRoom(createRoomDto: CreateRoomDto, user: UserEntity): Promise<RoomEntity> {
        const room = await this.roomRepository.findOne({ where: { name: createRoomDto.name } });
        if(room) {
            throw new HttpException('Room already exist with this name', HttpStatus.CONFLICT);
        }
        return this.roomRepository.save(this.roomRepository.create( {...createRoomDto, users: [user] }));
        
    }

    async addUserToRoom(id: number, user: UserEntity): Promise<boolean> {
        const room = await this.roomRepository.findOne({ where: { id } });
        if(room.users.find(u => u.id === user.id)) {
            throw new HttpException('Username already exists', HttpStatus.CONFLICT); 
        }
        room.users.push(user);
        await this.roomRepository.save(room);
        return true;
    }


}
