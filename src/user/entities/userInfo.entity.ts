import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_Info')
export class UserInfo{

    // @PrimaryGeneratedColumn()
    // id: number;

    // 이거 필요할 듯 싶다
    // @OneToOne(()=>User) 
    // @Column()
    // userId: number;

    // @Column()
    // userName: string;
    
    // @Column()
    // firstName: string;
    // @Column()
    // lastName: string;

    // @CreateDateColumn()
    // createdAt: string;
    // @UpdateDateColumn()
    // updatedAt: string;

    // @Column({nullable:true, default:' '})
    // profilePicture: string;
    // @Column({nullable:true, default:' '})
    // coverPicture: string;
    // @Column({nullable:true, default:' '})
    // about: string;
    // @Column({nullable:true, default:' '})
    // livesIn: string;
    // @Column({nullable:true, default:' '})
    // worksAt: string;
    // @Column({nullable:true, default:' '})
    // relationship: string;
    // @Column({nullable:true, default:' '})
    // country: string;

}