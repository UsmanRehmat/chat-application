import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomEntity } from './entity/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { MessageEntity } from '../message/entity/message.entity';

@Injectable()
export class RoomService {
    constructor(@InjectRepository(RoomEntity) private readonly roomRepository: Repository<RoomEntity>,
    private readonly userService: UserService, private readonly messageService: MessageService) {}
    async createRoom(createRoomDto: CreateRoomDto, user: UserEntity): Promise<RoomEntity> {
        const room = await this.roomRepository.findOne({ where: { name: createRoomDto.name } });
        if(room) {
            throw new HttpException('Room already exist with this name', HttpStatus.CONFLICT);
        }
        return this.roomRepository.save(this.roomRepository.create( {...createRoomDto, users: [user] }));
        
    }
    async addUserToRoom(id: number, userId: number): Promise<MessageEntity[]> {
        const user = await this.userService.getUserById(userId);
        const room = await this.roomRepository.findOne({ where: { id }, relations: {users: true} });
        if(room.users.find(u => u.id === user.id)) {
            throw new HttpException('You alrady join this room', HttpStatus.CONFLICT); 
        }
        room.users.push(user);
        await this.roomRepository.save(room);
        return this.messageService.findMessagesByRoomId(room.id);
    }

    async getRoomById(id: number): Promise<RoomEntity> {
        return this.roomRepository.findOne({where: { id }})
    }

    async getRoomsByUserId(userId: number): Promise<RoomEntity[]> {
        return this.roomRepository.find({where: { users: { id: userId} }})
    }

    async getAllRooms(): Promise<RoomEntity[]> {
        return this.roomRepository.find();
    }

    


}
