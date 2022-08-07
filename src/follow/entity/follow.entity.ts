import { User } from "src/user/entities/user.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('follow')
export class Follow{

    @PrimaryGeneratedColumn()
    id: string;

    
    @ManyToOne(
        ()=>User,
        (user)=>user.id,
        {eager:true}
    )
    // @Column('follower_id')
    follower:number; //팔로우 신청한 사람 id

    @ManyToOne(
        ()=>User,
        (user)=>user.id,
        {eager:true}
    )
    // @Column('following_id')
    following:number; //팔로우 신청 받은 사람 id

    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;

    // @ManyToOne(
    //     ()=>User,
    //     (user)=>user.following
    // )@JoinColumn([{name:'userId', referencedColumnName:'id'}])
    // follower:User[];


    // @ManyToOne(
    //     ()=>User,
    //     (user)=>user.followers
    // )@JoinColumn([{name:'userId', referencedColumnName:'id'}])
    // following:User[];
}