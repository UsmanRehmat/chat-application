import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {

    constructor(@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>) {}

    async createMessage(createMessageDto: CreateMessageDto) {
       return this.messageRepository.save(this.messageRepository.create(createMessageDto));
    }

    async findMessagesByRoomId(roomId: number) {
        return this.messageRepository.find({where: { room: { id: roomId}}, relations: { user: true }});
    }

    
}
