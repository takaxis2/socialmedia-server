import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { Chat } from "./entity/chat.entity";
import { Member } from "./entity/chat_user.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Chat, Member])],
    controllers:[ChatController],
    providers:[ChatService],
    exports:[]
})
export class ChatModule{}