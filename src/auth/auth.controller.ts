import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { Request } from 'express';
import { LogInDto } from 'src/user/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body(ValidationPipe) loginDto:LogInDto){
    
    const jwt = await this.authService.login(loginDto);
    return jwt;
  }

  




}
