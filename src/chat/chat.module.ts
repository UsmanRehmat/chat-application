import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MessageModule, RoomModule, UserModule, AuthModule],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}