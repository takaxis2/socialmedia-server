import { Strategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
        private readonly userService: UserService
    ){
        super({
            // jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
    };

    async validate(payload,){

        // console.log('validate');

        // const user = await this.userService.getUserById(payload.id);

        // if(!user == null){
        //     throw new UnauthorizedException('권한이 없습니다');
        // }

        // return done(null, payload);
        return payload
    }
}