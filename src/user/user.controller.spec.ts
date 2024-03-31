import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Sign } from 'crypto';
import { SingInUserDto } from './dto/signin-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{provide: UserService, useValue: { createUser: jest.fn(), signIn: jest.fn()}}]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('create user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user'
    }
    const createdUser = {id:1}
     jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);
     const user = await controller.create(createUserDto);
     expect(user).toEqual(createdUser);
  });

  it('signIn', async () => {
    
    const signInUserDto: SingInUserDto  = {
      email: 'user1@chat.com',
      password: 'user'
    }
    const jwtToken = 'sfasdsadq2342';
    const mockToken = {
      access_token: jwtToken,
      token_type: 'JWT',
      expires_in: 10000
    }
     jest.spyOn(userService, 'signIn').mockResolvedValue(jwtToken);
     const token = await controller.login(signInUserDto);
     expect(token).toEqual(mockToken);
  });

  
});
