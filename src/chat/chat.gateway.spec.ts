import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { MessageService } from '../message/message.service';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/service/auth.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messageService: MessageService;
  let roomService: RoomService;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, 
        { provide: MessageService, useValue: { createMessage: jest.fn()} },
        { provide: RoomService, useValue: { getRoomsByUserId: jest.fn()} },
        { provide: UserService, 
          useValue: { 
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            getUserBySocketId: jest.fn(),
            setAllUsersToInactive: jest.fn(),
            getLiveUsersByRoomId: jest.fn()
          } 
        },
        { provide: AuthService, useValue: { verifyJwt: jest.fn()} }
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    messageService = module.get<MessageService>(MessageService);
    roomService = module.get<RoomService>(RoomService);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('gateway should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('messageService should be defined', () => {
    expect(messageService).toBeDefined();
  });

  it('roomService should be defined', () => {
    expect(roomService).toBeDefined();
  });
  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });
  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });
});
