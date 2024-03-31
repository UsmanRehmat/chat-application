import { Body, Controller, Get, Logger, Param, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessageEntity } from './entity/message.entity';

@Controller('message')
export class MessageController {
    logger = new Logger(MessageController.name);

    constructor(private readonly messageService: MessageService) {}

    @ApiBearerAuth()
    @Get('/rooms/:roomId')
    async getRoomMessages(@Param('roomId') roomId: number ,@Req() request): Promise<MessageEntity[]> {
        this.logger.debug('getRoomMessages');
        return this.messageService.findMessagesByRoomId(roomId);
    }
}
