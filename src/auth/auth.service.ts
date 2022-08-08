import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/user/entities/userInfo.entity';
import { LogInDto } from 'src/user/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Follow } from 'src/follow/entity/follow.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Follow) private followRepository: Repository<Follow>,
        private readonly jwtService: JwtService,
        private dataSource:DataSource
    ){};
 
    async login(logInDto:LogInDto){

        // const tUser:User = await this.userRepository.findOne(
        //     {
        //         where:{email:logInDto.email},
        //         // relations:['followers', 'following', ],
        //     }
        //     );


        //** 여기랑 밑은 leftJoin이냐 innerJoin이냐의 차인데 결과는 똑같이 나온다 */
        // const qUser = await this.dataSource
        // .getRepository(User)
        // .createQueryBuilder('user')
        // .leftJoinAndSelect('user.followings', 'followings')//user.followings로 follow테이블 조인
        // .leftJoinAndSelect('user.followers', 'followers')//user.followers로 follow테이블 조인

        // .leftJoin('followings.following','following_user')//follow.following_id 기준으로 user 조인
        // .addSelect('following_user.id')//user.id 검색
        // .addSelect('following_user.userName')//user.userName 검색

        // .leftJoin('followers.follower','follower_user')//follow.follower_id 기준으로 user 조인
        // .addSelect('follower_user.id')//user.id 검색
        // .addSelect('follower_user.userName')//user.userName 검색
        // .where('user.email = :email',{email: logInDto.email})
        // .getOne()

        
        const tUser = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.followings','followings')
        .innerJoin('followings.following', 'following_user')
        .addSelect('following_user.id')
        .addSelect('following_user.userName')

        .innerJoinAndSelect('user.followers','followers')
        .innerJoin('followers.follower','follower_user')
        .addSelect('follower_user.id')
        .addSelect('follower_user.userName')
        .where('user.email = :email',{email: logInDto.email})
        .getOne()

         
        if(tUser == null){
            throw new NotFoundException('없는 이메일 입니다');
        }

        if(await bcrypt.compare(logInDto.password, tUser.password) == false){
            throw new UnauthorizedException('비밀번호가 틀립니다');
        }

        if(tUser.followings.length != 0){
            const followings = tUser.followings.map((following)=>{
                const following_user = following.following;
                const user ={
                    id: following_user.id,
                    userName: following_user.userName,
                    // profilePicture:following_user.profilePicture,
                }
                return user;
                
            }); 
            tUser.followings = followings;

        }
        if(tUser.followers != null){

            const followers = tUser.followers.map((follower)=>{
                const follow_user = follower.follower;
                const user ={
                    id: follow_user.id,
                    userName: follow_user.userName,
                    // profilePicture:follow_user.profilePicture,
                }
                return user;
            }); 
            
            tUser.followers = followers;
        }
        
       

        const {password, ...user} = tUser;

      
        return {
            user,
            access_Token: this.jwtService.sign(user,{secret:process.env.JWT_SECRET}), //이거 사인이 mal signed다, invalid sign이다 그런게 이거 때문인듯
           
        };
    }

    
 
}
