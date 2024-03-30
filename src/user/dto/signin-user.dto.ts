import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SingInUserDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
  
  }