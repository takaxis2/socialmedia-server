import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {  } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Request } from 'express';
import { Token } from 'src/decorator/token.decorator';
import { User } from 'src/user/entities/user.entity';

//jwt가드 붙여야 쓰것다
@UseGuards(JwtAuthGuard)
@Controller('posts') 
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() postDto:CreatePostDto){

    const post = await this.postService.create(postDto);

   return post;
  }

  

  @Get('/:id')
  async getPost(@Param('id') id:number){
    const post = await this.postService.findOne(id);
    
    return post;
  }
  
  @Put('/:id')
  async updatePost(@Param('id') id:number, updateDto: UpdatePostDto){
    const post = await this.postService.update(id, updateDto);

    return post;
  }

  @Delete(':id')
  async deletePost(@Param('id') id:number, @Token() user:User){

    await this.postService.remove(id, user);

  }

  @Put('/:id/like')
  async likePost(@Param('id') id:number, @Token() user:User,){

    console.log(typeof id);
      return await this.postService.likePost(id, user);
  }
  
  @Get('/:id/timeline')
  async getTimelinePosts(@Param('id') id:number,@Token() user:User){
    const result = await this.postService.getTimelinePosts(id, user);
    return result;
  }

}
