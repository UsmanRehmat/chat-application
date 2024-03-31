import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/auth/service/auth.service";
import { UserService } from "src/user/user.service";
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private userService: UserService) { }

  async use(req: any, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const user = await this.userService.getUserById(decodedToken.user.id);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch(ex) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

}