import { IsNotEmpty, IsString, IsEmail, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    socketId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;


    @ApiProperty()
    @IsBoolean()
    isLive: boolean;
  
  }