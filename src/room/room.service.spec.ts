import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { RoomEntity } from './entity/room.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from '../config/typeorm';

describe('RoomService', () => {
  let roomService: RoomService;
  let roomRepository: Repository<RoomEntity>;
 
  const mockRoomService = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, MessageModule, ConfigModule.forRoot({
        isGlobal: true,
        load: [typeorm]
      }), TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
      })],
      providers: [RoomService, {provide: getRepositoryToken(RoomEntity), useValue: mockRoomService}],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
    roomRepository = module.get<Repository<RoomEntity>>(getRepositoryToken(RoomEntity));
  });

  it('roomService should be defined', () => {
    expect(roomService).toBeDefined();
  });

  it('roomRepository should be defined', () => {
    expect(roomRepository).toBeDefined();
  });
});
