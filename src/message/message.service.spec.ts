import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: Repository<MessageEntity>;
 
  const mockMessageService = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService, { provide: getRepositoryToken(MessageEntity) , useValue: mockMessageService}, ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    messageRepository = module.get<Repository<MessageEntity>>(getRepositoryToken(MessageEntity));
  });

  it('messageService should be defined', () => {
    expect(messageService).toBeDefined();
  });

  it('messageRepository should be defined', () => {
    expect(messageService).toBeDefined();
  });

  it('should return empty array of messages on room id that does not exist or without any message', async() => {
    const mockMessages = [];
    const roomId = -1;
     jest.spyOn(messageRepository, 'find').mockResolvedValue(mockMessages);
     const messages = await messageService.findMessagesByRoomId(roomId);
     expect(messageRepository.find).toHaveBeenCalledWith({where: { room: { id: roomId}}, relations: { user: true }});
     expect(messages).toEqual(mockMessages);
  });

  it('should return messages of room', async() => {
    const mockMessages = [
      {
        id: 2,
        text: "first message",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    const roomId = 1;
     jest.spyOn(messageRepository, 'find').mockResolvedValue(mockMessages);
     const messages = await messageService.findMessagesByRoomId(roomId);
     expect(messageRepository.find).toHaveBeenCalledWith({where: { room: { id: roomId}}, relations: { user: true }});
     expect(messages).toEqual(mockMessages);
  });

  it('should create message object ', async() => {
    const mockMessage = {
      id: 2,
      text: "first message",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createMessageDto: CreateMessageDto = {
      text: "first message",
      room: { id: 1 }
    }
    jest.spyOn(messageRepository, 'save').mockResolvedValue(mockMessage);
    const message = await messageService.createMessage(createMessageDto);
    expect(messageRepository.create).toHaveBeenCalledWith(createMessageDto);
    expect(message).toEqual(mockMessage);
  });
});
