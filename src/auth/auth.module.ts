import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follow } from 'src/follow/entity/follow.entity';

@Module({
  imports:[
    PassportModule.register({
      defaultStrategy:'jwt'
    }),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn : '3600s'},
      
    }),
    TypeOrmModule.forFeature([User, Follow]),
  ],
  controllers: [AuthController],
  providers: [ AuthService,  ],
  exports:[PassportModule, JwtModule]
})
export class AuthModule {}

