import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put, Req, UseGuards, Query } from '@nestjs/common';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { timeLog } from 'console';
import { Token } from 'src/decorator/token.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create") //얘를 auth로 빼야할것같다
  async register(@Body(ValidationPipe) registerDto: RegisterDto){
    console.log('creating user');
    const user:User = await this.userService.createUser(registerDto);
    
    return user;
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id') id: number,){

    const user = await this.userService.getUserById(id);

    return user;
  }

  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(){

    const users: Object[] = await this.userService.getAllUsers();

    return users;  

  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body()updateDto: UpdateDto,@Param('id') id:number, @Token() user:User){
    
    const _id = id;
    
    this.userService.updateUser(updateDto, _id, user);

  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id')id:number, @Token() user:User){
    this.userService.deleteUser(id, user);
  }


  @Put('/:id/follow')
  @UseGuards(JwtAuthGuard)
  async follow(@Param('id')id:number, @Token() user:User){
    await this.userService.followUser(id, user);

  }

  @Put('/:id/unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id')id:number, @Token() user:User){
    await this.userService.unfollowUser(id, user);
  }
}
