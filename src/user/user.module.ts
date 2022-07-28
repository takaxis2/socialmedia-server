import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Follow } from 'src/follow/entity/follow.entity';


@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([User, Follow]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports:[UserModule,   ],
  
})
export class UserModule {}
