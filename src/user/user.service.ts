import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SingInUserDto } from './dto/signin-user.dto';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
    
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>, 
    private readonly authService: AuthService) {}

    async createUser(createUserDto: CreateUserDto) {

        const user = await this.findUserByUsername(createUserDto.username);
        if (user) {
            throw new HttpException('Username already exists', HttpStatus.CONFLICT);
        }
        const newUser = this.userRepository.create({ ...createUserDto })
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const savedUser = await this.userRepository.save(newUser);
        return { id: savedUser.id };
    }

    async signIn(signInUserDto: SingInUserDto) {
        const user = await this.getUserByEmail(signInUserDto.email);
        if(!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const matched = this.validatePassword(signInUserDto.password, user.password);
        if(!matched) {
            throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
        }
        return this.authService.generateJwt(user);

    }

    async findUserByUsername(username: string) {
        return this.userRepository.findOne({ where: { username }});
    }

    async getUserById(id: number) {
        return this.userRepository.findOne({ where: { id }});
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findOne({ where: { email }, select: 
            ['id', 'email', 'password', 'username']
        });
    }

    private async hashPassword(password: string): Promise<string> {
        return this.authService.hashPassword(password);
      }
    
      private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
        return this.authService.comparePasswords(password, storedPasswordHash);
      }

}