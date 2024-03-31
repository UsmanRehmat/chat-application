import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/entity/user.entity";

export class CreateMessageDto {
    text: string;
    user?: Partial<UserEntity>;
    room: Partial<RoomEntity>;
}