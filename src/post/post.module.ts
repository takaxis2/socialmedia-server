import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { PostLike } from './entities/post_like.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports:[
    TypeOrmModule.forFeature([Post, PostLike]),
    AuthModule
  ]
})
export class PostModule {}
