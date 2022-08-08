import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('chat_member')
export class Member{

    @PrimaryGeneratedColumn()
    id: string;

    
    @ManyToOne(
        ()=>Chat,
        (chat)=>chat.id,
        {
            eager:true,
            onDelete:'CASCADE'
        }
    )
    chat:number; 

    @ManyToOne(
        ()=>User,
        (user)=>user.id,
        {
            eager:true,
            onDelete:'CASCADE'
        }
    )
    user:number; 

    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;

}