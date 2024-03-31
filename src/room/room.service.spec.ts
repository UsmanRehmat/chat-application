import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { RoomEntity } from './entity/room.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { UserEntity } from '../user/entity/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { HttpException } from '@nestjs/common';

describe('RoomService', () => {
  let roomService: RoomService;
  let roomRepository: Repository<RoomEntity>;
  let userService: UserService;
  let messageService: MessageService;
 
  const mockRoomService = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  }

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService, 
        { provide: getRepositoryToken(RoomEntity), useValue: mockRoomService},
        { provide: UserService, useValue: { getUserById: jest.fn()}},
        { provide: MessageService, useValue: { findMessagesByRoomId: jest.fn()}}
      ],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
    userService = module.get<UserService>(UserService);
    messageService = module.get<MessageService>(MessageService);
    roomRepository = module.get<Repository<RoomEntity>>(getRepositoryToken(RoomEntity));
  });

  it('roomService should be defined', () => {
    expect(roomService).toBeDefined();
  });

  it('roomRepository should be defined', () => {
    expect(roomRepository).toBeDefined();
  });

  it('getRoomById', async () => {
    const mockRoom: RoomEntity = {
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z")
    };
     jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
     const room = await roomService.getRoomById(mockRoom.id);
     expect(roomRepository.findOne).toHaveBeenCalledWith({where: { id: mockRoom.id } });
     expect(room).toEqual(mockRoom);
  });

  it('getRoomsByUserId', async () => {
    const mockRooms: RoomEntity[] = [{
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z")
    }];
    const userId = 1;
     jest.spyOn(roomRepository, 'find').mockResolvedValue(mockRooms);
     const rooms = await roomService.getRoomsByUserId(userId);
     expect(roomRepository.find).toHaveBeenCalledWith({where: { users: { id: userId} }});
     expect(rooms).toEqual(mockRooms);
  });

  it('getAllRooms', async () => {
    const mockRooms: RoomEntity[] = [{
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z")
    }];
     jest.spyOn(roomRepository, 'find').mockResolvedValue(mockRooms);
     const rooms = await roomService.getAllRooms();
     expect(rooms).toEqual(mockRooms);
  });

  it('createRoom', async () => {
    const mockRoom: RoomEntity = {
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z")
    };

    const createRoomDto: CreateRoomDto = {
      name: "room1"
    }
    const user: Partial<UserEntity>  = {
      id: 1,
    }
     jest.spyOn(roomRepository, 'findOne').mockResolvedValue(undefined);
     jest.spyOn(roomRepository, 'save').mockResolvedValue(mockRoom);
     const room = await roomService.createRoom(createRoomDto, user);
     expect(roomRepository.create).toHaveBeenCalledWith({...createRoomDto, users: [user] });
     expect(room).toEqual(mockRoom);
  });

  it('createRoom already exist case', async () => {
    const mockRoom: RoomEntity = {
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z")
    };
    const createRoomDto: CreateRoomDto = {
      name: "room1"
    }
    const user: Partial<UserEntity>  = {
      id: 1,
    }
     jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
     jest.spyOn(roomRepository, 'save').mockResolvedValue(mockRoom);
     try {
      const room = await roomService.createRoom(createRoomDto, user);
     } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
     }
     
  });

  it('addUserToRoom', async () => {
    const mockRoom: RoomEntity = {
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z"),
      users: []
    };

    const createRoomDto: CreateRoomDto = {
      name: "room1"
    }
    const user: UserEntity  = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      emailToLowerCase: function (): void {}
    }
    const mockMessages = [
      {
        id: 2,
        text: "first message",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
     jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
     jest.spyOn(roomRepository, 'findOne').mockResolvedValue(mockRoom);
     jest.spyOn(messageService, 'findMessagesByRoomId').mockResolvedValue(mockMessages);
     
     const messages = await roomService.addUserToRoom(mockRoom.id, user.id);
     expect(userService.getUserById).toHaveBeenCalledWith(user.id);
     expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: mockRoom.id }, relations: {users: true} });
     expect(messageService.findMessagesByRoomId).toHaveBeenCalledWith(mockRoom.id);
     expect(roomRepository.save).toHaveBeenCalledWith({...mockRoom, users:[user]});
     expect(messages).toEqual(mockMessages);
  });

  it('user already joined room', async () => {
    const mockRoom: RoomEntity = {
      "id": 1,
      "name": "room1",
      "description": null,
      "createdAt": new Date("2024-03-30T06:04:36.241Z"),
      "updatedAt": new Date("2024-03-30T06:04:36.241Z"),
      users: []
    };

    const createRoomDto: CreateRoomDto = {
      name: "room1"
    }
    const user: UserEntity  = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      emailToLowerCase: function (): void {}
    }
    const mockMessages = [
      {
        id: 2,
        text: "first message",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
     jest.spyOn(userService, 'getUserById').mockResolvedValue(user);
     jest.spyOn(roomRepository, 'findOne').mockResolvedValue({...mockRoom, users: [user]});
     jest.spyOn(messageService, 'findMessagesByRoomId').mockResolvedValue(mockMessages);
     
     try {
      const messages = await roomService.addUserToRoom(mockRoom.id, user.id); 
      expect(userService.getUserById).toHaveBeenCalledWith(user.id);
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: mockRoom.id }, relations: {users: true} });
      expect(messageService.findMessagesByRoomId).toHaveBeenCalledWith(mockRoom.id);
      expect(roomRepository.save).toHaveBeenCalledWith({...mockRoom, users:[user]});
      expect(messages).toEqual(mockMessages);
     } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
     }
  });
});
