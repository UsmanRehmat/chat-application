import { IsNotEmpty, IsString, IsEmail, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    roomId: number;
  
  }