import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{provide: MessageService, useValue: { findMessagesByRoomId: jest.fn()}}]
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('messageService should be defined', () => {
    expect(messageService).toBeDefined();
  });
});
