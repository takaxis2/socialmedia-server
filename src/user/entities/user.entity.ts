import { Follow } from 'src/follow/entity/follow.entity';
import { Post } from 'src/post/entities/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { UserInfo } from './userInfo.entity';


@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({default:false})
    isAdmin: boolean;

    @Column()
    email: string
    @Column()
    password: string;
    @Column()
    userName: string;
    
    @Column()
    firstName: string;
    @Column()
    lastName: string;

    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;

    @Column({nullable:true, default:''})
    profilePicture: string;
    @Column({nullable:true, default:''})
    coverPicture: string;
    @Column({nullable:true, default:''})
    about: string;
    @Column({nullable:true, default:''})
    livesIn: string;
    @Column({nullable:true, default:''})
    worksAt: string;
    @Column({nullable:true, default:''})
    relationship: string;
    @Column({nullable:true, default:''})
    country: string;

    @OneToMany(
        ()=>Follow,
        (follow)=>follow.following,
    )
    // @ManyToMany(()=>User,(user)=>user.id)
    // @JoinTable()
    followers: User[] | any[];


    @OneToMany(
        ()=>Follow,
        (follow)=>follow.follower,
        
    )
    // @ManyToMany(()=>User,(user)=>user.id)
    // @JoinTable()
    followings: User[] | any[];


    // @OneToMany(
    //     ()=>Post,
    //     (post)=>post.userId
    // )
    // post:Post[];

    //생성일 업댓일 인터페이스로 만들기
    
    
}
