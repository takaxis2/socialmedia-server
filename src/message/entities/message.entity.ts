import { Chat } from "src/chat/entity/chat.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn()
    id:number;

    /**
     * onDelete:'CASCADE' 옵션을 주면 Chat이 삭제될시 관련된 message도 같이 삭제됨
     */
    @ManyToOne(
        ()=>Chat,
        (chat)=>chat.id,
        {
            onDelete:'CASCADE'
        }
    )
    chatId:number;

    @Column()
    senderId:number;

    @Column()
    text:string;
    
    @CreateDateColumn()
    createdAt:string;

}
