import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class PostLike{

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(
        ()=>User,
        (user)=>user.id,
        {eager:true}
    )
    userId: number;

    @ManyToOne(
        ()=>Post,
        (post)=>post.id,
        {eager:true}
    )
    postId: number;

}