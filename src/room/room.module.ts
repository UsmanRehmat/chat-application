import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomEntity } from './entity/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity]),],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService]
})
export class RoomModule {}
