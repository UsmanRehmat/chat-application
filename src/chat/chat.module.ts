import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MessageModule, RoomModule, UserModule],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}