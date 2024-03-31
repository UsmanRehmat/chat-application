import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

describe('RoomController', () => {
  let controller: RoomController;
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [{provide: RoomService, useValue: {
        createRoom: jest.fn(),
        addUserToRoom: jest.fn(),
        getAllRooms: jest.fn(),
        getRoomsByUserId: jest.fn(),
      }}]
    }).compile();

    controller = module.get<RoomController>(RoomController);
    roomService = module.get<RoomService>(RoomService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('roomService should be defined', () => {
    expect(roomService).toBeDefined();
  });
});
