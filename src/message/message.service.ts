import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {

    logger = new Logger(MessageService.name);

    constructor(@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>) {}

    async createMessage(createMessageDto: CreateMessageDto) {
       this.logger.debug('createMessage'); 
       return this.messageRepository.save(this.messageRepository.create(createMessageDto));
    }

    async findMessagesByRoomId(roomId: number) {
        this.logger.debug('findMessagesByRoomId');
        return this.messageRepository.find({where: { room: { id: roomId}}, relations: { user: true }});
    }

    
}
