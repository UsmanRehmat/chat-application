import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SingInUserDto } from './dto/signin-user.dto';

@Controller('user')
export class UserController {
    logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<{id: number}> {
        this.logger.debug('create');
        return this.userService.createUser(createUserDto);
    }

  @Post('signIn')
  async login(@Body() signInUserDto: SingInUserDto) {
    this.logger.debug('login');
    const jwt: string = await this.userService.signIn(signInUserDto);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000
    };
  }
}
