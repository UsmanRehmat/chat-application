import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/entity/user.entity';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync({user});
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

}
