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

    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;



}