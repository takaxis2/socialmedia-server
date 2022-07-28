import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport"
import { Observable } from 'rxjs';
        
          
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        
        if(err || !user){
            console.log(info); //에러나면 내용 볼 수 있게
            throw err || new UnauthorizedException('아몰랑');
        }
        return user;
    }
 }