import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly datasource:DataSource,
  ){};

  async create(messageDto: CreateMessageDto) {

    try {
     
    const message = new Message();
    message.chatId = messageDto.chatId;
    message.senderId = messageDto.senderId;
    message.text = messageDto.text;

    const result = await this.messageRepository.save(message);

    return result; 
    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

 
  async findOne(id: number) {

    try {
      const messages = await this.messageRepository.createQueryBuilder('message')
    .select('message.chatId')
    .addSelect('message.text')
    .addSelect('message.senderId')
    .where('message.chatId = :id',{id:id})
    .getMany();

    return messages;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  

}
