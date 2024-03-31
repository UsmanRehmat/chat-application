import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/service/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryMockFactory } from '../mocks/repository/repository.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { SingInUserDto } from './dto/signin-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, 
        { provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          } 
        },
        { provide: AuthService,
          useValue: { hashPassword: jest.fn(), comparePasswords: jest.fn(), generateJwt: jest.fn()}
        }
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    authService = module.get<AuthService>(AuthService);
  });

  it('userService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('createUser', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user',
      emailToLowerCase: function (): void {}
    };

    const createUserDto: CreateUserDto = {
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user'
    }
     jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
     jest.spyOn(userRepository, 'create').mockReturnValue(user);
     jest.spyOn(userRepository, 'save').mockResolvedValue(user);
     const userId = await service.createUser(createUserDto);
     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
     expect(userId).toEqual({id: user.id});
  });

  it('createUser with username already exist', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user',
      emailToLowerCase: function (): void {}
    };

    const createUserDto: CreateUserDto = {
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user'
    }
     jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
     jest.spyOn(userRepository, 'create').mockReturnValue(user);
     jest.spyOn(userRepository, 'save').mockResolvedValue(user);
     try {
      const userId = await service.createUser(createUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
      expect(userId).toEqual({id: user.id});
     } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
     }
     
  });

  it('signIn', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user',
      emailToLowerCase: function (): void {}
    };

    const signInUserDto: SingInUserDto = {
      email: 'user1@chat.com',
      password: 'user'
    }
    const jwtToken = 'sadas1092389djasdla'
     jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
     jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
     jest.spyOn(authService, 'generateJwt').mockResolvedValue(jwtToken);
     try {
      const token = await service.signIn(signInUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInUserDto.email },
        select: ["id", "email", "password", "username"],
      });
      expect(authService.comparePasswords).toHaveBeenCalledWith(signInUserDto.password, user.password);
      expect(token).toEqual(jwtToken);
     } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
     }
     
  });


  it('signIn with wrong email', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user',
      emailToLowerCase: function (): void {}
    };

    const signInUserDto: SingInUserDto = {
      email: 'user1@chat.com',
      password: 'user'
    }
    const jwtToken = 'sadas1092389djasdla'
     jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
     jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
     jest.spyOn(authService, 'generateJwt').mockResolvedValue(jwtToken);
     try {
      const token = await service.signIn(signInUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInUserDto.email },
        select: ["id", "email", "password", "username"],
      });
      expect(authService.comparePasswords).toHaveBeenCalledWith(signInUserDto.password, user.password);
      expect(token).toEqual(jwtToken);
     } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
     }
     
  });

  it('signIn with wrong password', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'user1',
      email: 'user1@chat.com',
      password: 'user',
      emailToLowerCase: function (): void {}
    };

    const signInUserDto: SingInUserDto = {
      email: 'user1@chat.com',
      password: 'user'
    }
    const jwtToken = 'sadas1092389djasdla'
     jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
     jest.spyOn(authService, 'comparePasswords').mockResolvedValue(false);
     jest.spyOn(authService, 'generateJwt').mockResolvedValue(jwtToken);
     try {
      const token = await service.signIn(signInUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: signInUserDto.email },
        select: ["id", "email", "password", "username"],
      });
      expect(authService.comparePasswords).toHaveBeenCalledWith(signInUserDto.password, user.password);
      expect(token).toEqual(jwtToken);
     } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
     }
     
  });

});
