import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Member } from "./chat_user.entity";


@Entity()
export class Chat{

    @PrimaryGeneratedColumn()
    id:number;

 
    @OneToMany(
        ()=>Member,
        (member)=>member.chat,
        {cascade:true}
    )
    members: number[] | any[];

    /**
     * cascade:true옵션은 chat에 message이 추가되고 chat이 저장될때 message또한 반드시 db에 저장된다.cascade:true옵션이 없을시 위의 코드에서 message는 db에 저장되지 않을것이다.
     */
    // @OneToMany(
    //     ()=>Message,
    //     (message)=>message.chatId,
    //     {cascade:true}
    // )
    // messages: Message[]

    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;



}