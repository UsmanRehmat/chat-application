import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule {}
