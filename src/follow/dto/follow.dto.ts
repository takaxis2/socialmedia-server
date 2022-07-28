import { IsNumber } from 'class-validator';

export class FollowDto{

    @IsNumber()
    follower_id:number;
    @IsNumber()
    followinf_id:number;

}