import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostLike } from "./post_like.entity";

@Entity('post')
export class Post {

    @PrimaryGeneratedColumn()
    id:number;
    
    @Column({nullable:true, default:''})
    desc:string;

    @Column({nullable:true, default:''})
    image:string;
    
    @CreateDateColumn()
    createdAt:string;
    
    @UpdateDateColumn()
    updatedAt:string;
    
    @OneToMany(
        ()=>PostLike,
        (postLike)=>postLike.postId) //이거 생각좀 해봐야것다
    likes:number[] | any[];

    // @ManyToOne(
    //     ()=>User,
    //     (user)=>user.id
    // )
    @Column()
    userId:number;

}
