import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomEntity } from './entity/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
import { MessageEntity } from 'src/message/entity/message.entity';

@Injectable()
export class RoomService {
    logger = new Logger(RoomService.name);
    constructor(@InjectRepository(RoomEntity) private readonly roomRepository: Repository<RoomEntity>,
    private readonly userService: UserService, private readonly messageService: MessageService) {}
    async createRoom(createRoomDto: CreateRoomDto, user: UserEntity): Promise<RoomEntity> {
        this.logger.debug('createRoom');
        const room = await this.roomRepository.findOne({ where: { name: createRoomDto.name } });
        if(room) {
            throw new HttpException('Room already exist with this name', HttpStatus.CONFLICT);
        }
        return this.roomRepository.save(this.roomRepository.create( {...createRoomDto, users: [user] }));
        
    }
    async addUserToRoom(id: number, userId: number): Promise<MessageEntity[]> {
        this.logger.debug('addUserToRoom');
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
        this.logger.debug('getRoomId');
        return this.roomRepository.findOne({where: { id }})
    }

    async getRoomsByUserId(userId: number): Promise<RoomEntity[]> {
        this.logger.debug('getRoomByUserId');
        return this.roomRepository.find({where: { users: { id: userId} }})
    }

    async getAllRooms(): Promise<RoomEntity[]> {
        this.logger.debug('getAllRooms');
        return this.roomRepository.find();
    }

    


}
