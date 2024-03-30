import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class MessageEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, user => user.messages)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, room => room.messages)
  room: RoomEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}