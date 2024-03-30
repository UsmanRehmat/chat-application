import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async createUser(createUserDto: CreateUserDto) {

        const user = await this.findUserByUsername(createUserDto.username);
        if (user.length > 0) {
            throw new HttpException('Username already exists', HttpStatus.CONFLICT);
        }
        return this.userRepository.save(this.userRepository.create({ ...createUserDto }));
    }

    async findUserByUsername(username: string) {
        return this.userRepository.find({ where: { username }});
    }

}
