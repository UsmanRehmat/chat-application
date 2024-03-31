import { MessageEntity } from "../../message/entity/message.entity";
import { UserEntity } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({nullable: true})
    description: string;
  
    @ManyToMany(() => UserEntity)
    @JoinTable()
    users?: UserEntity[];
  
    @OneToMany(() => MessageEntity, message => message.room)
    messages?: MessageEntity[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
  }