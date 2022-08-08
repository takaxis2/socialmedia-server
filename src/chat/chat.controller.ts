import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatDto } from "./dto/chat.dto";

@Controller('/chat')
export class ChatController{
    constructor(private readonly chatService :ChatService){}

    @Post('/')
    async createChat(@Body()chatDto:ChatDto){
       const chat = await this.chatService.createChat(chatDto);
       return chat;
    }

    @Get('/:userId')
    async userChats(@Param('userId') userId: number){
        const chat = await this.chatService.userChats(userId);
        return chat;
    }

    @Get('/find/:firstId/:secondId')
    async findChat(@Param('firstId')firstId:number, @Param('secondId')secondId:number){
        const chat = await this.chatService.findChat(firstId, secondId);
        return chat;
    }

}