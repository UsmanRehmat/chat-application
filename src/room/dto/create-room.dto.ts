import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    description?: string;
  
  }