import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoomEntity } from 'src/room/entity/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoomEntity]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
