import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessageEntity } from './entity/message.entity';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @ApiBearerAuth()
    @Get('/rooms/:roomId')
    async getRoomMessages(@Param('roomId') roomId: number ,@Req() request): Promise<MessageEntity[]> {
        return this.messageService.findMessagesByRoomId(roomId);
    }
}
