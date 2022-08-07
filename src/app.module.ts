import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserInfo } from './user/entities/userInfo.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/entity/follow.entity';
import { Post } from './post/entities/post.entity';
import { PostLike } from './post/entities/post_like.entity';
import { UploadModule } from './upload/upload.module';
import { Chat } from './chat/entity/chat.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type:'mysql',
      host: `${process.env.DB_HOST}`,
      port: 56448,
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities:[User,Follow, Post, PostLike, Chat],
      synchronize: true,
      logging:true,
      // migrationsRun:false, //이거랑 위에거 둘중 하나만 true여야 이미 있는 테이블이라 안뜬다
    }),
    
    AuthModule,
    UserModule,
    PostModule,
    FollowModule,
    UploadModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
