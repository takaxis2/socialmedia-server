import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { ChatDto } from "./dto/chat.dto";
import { Chat } from "./entity/chat.entity";
import { Member } from "./entity/chat_user.entity";

@Injectable()
export class ChatService{
    constructor(
        @InjectRepository(Chat) private chatRepository:Repository<Chat>,
        @InjectRepository(Member) private memberRepository:Repository<Member>,
        private datasource:DataSource
    ){};

    
    async createChat(chatDto:ChatDto){
       try {
        const chat = new Chat();
        // chat.members = [chatDto.senderId, chatDto.receiverId];
        const result = await this.chatRepository.save(chat);

        const member1 = new Member();
        member1.chat = result.id;
        member1.user = chatDto.senderId
        
        const member2 = new Member();
        member2.chat = result.id;
        member2.user = chatDto.receiverId;

        await this.memberRepository.save(member1);
        await this.memberRepository.save(member2);

        return result;
       } catch (error) {
        throw new InternalServerErrorException();
       }
    }

    async userChats(userId: number){

        try {
            const chats = await this.datasource.getRepository(Chat)
            .createQueryBuilder('chat')
            .select('chat.id')
            .innerJoin('chat.members', 'members')
            .addSelect('members.id')
            .innerJoin('members.user','user')
            .addSelect('user.id')
            .where('user.id = :userId',{userId:userId})
            .getMany();

            const chatIds = chats.map((chat)=>{
                return chat.id
            })

            const userChats = await this.datasource.getRepository(Chat)
            .createQueryBuilder('chat')
            .select('chat.id')
            .where('chat.id IN (:...ids)',{ids:chatIds})
            .innerJoin('chat.members', 'members')
            .addSelect('members.id')
            .innerJoin('members.user','user')
            .addSelect('user.id')
            .getMany();

            
            userChats.map((chat)=>{
                const result = chat.members.map((member)=>{
                    return member.user.id;
                });

                chat.members = result;
            })

            
            return userChats;

        } catch (error) {
            throw error;
        }

    }

    async findChat(firstId:number, secondId:number){

        try {
            const chat = await this.datasource.getRepository(Chat)
            .createQueryBuilder('chat')
            .select('chat.id')
            .addSelect('chat.createdAt')
            .innerJoin('chat.members', 'members')
            .addSelect('members.id')
            .innerJoin('members.user', 'user')
            .addSelect('user.id')
            .where('user.id = :firstId',{firstId:firstId})
            .orWhere('user.id = :secondId', {secondId:secondId})
            .getMany();
            
            return chat;

        } catch (error) {
            throw new InternalServerErrorException();
        }


    }
}