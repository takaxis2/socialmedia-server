import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
// import { activeUsers } from './onLineMap';

@WebSocketGateway(8800, {
  cors:{
    origin:'http://localhost:3000'
  }
})
export class EventsGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  constructor(){};

  @WebSocketServer()
  server:Server;

  /**
   * 이거 room을 유저라고 해놔서 겁나 햇갈림
   * 유저 아이디와 해당 room을 배열에다가 저장, 
   * 보낼때는 받는 사람 아이디로 room검색후 전송
   */
  private activeUsers =[];

  private logger:Logger = new Logger();

  @SubscribeMessage("new-user-add")
  findAll(@MessageBody() newUserId: any,
   @ConnectedSocket() socket:Socket) {
    
     if(!this.activeUsers.some((user)=>user.userId === newUserId)){
       this.activeUsers.push({userId: newUserId, socketId: socket.id});
      }
      // console.log(socket.rooms, socket.id, this.activeUsers, newUserId);
      // console.log(newUserId)
    // return { event: 'get-users', data: this.activeUsers }
    socket.emit('get-users', this.activeUsers);
    // this.server.emit('get-user', this.activeUsers);
    this.logger.log('get-user emitted');

  }

  @SubscribeMessage("send-message")
  async identity(@MessageBody() data: any,
  @ConnectedSocket() socket:Socket) {
    const {receiverId} =data;
    const user = this.activeUsers.find((user)=>user.userId === receiverId);
    console.log(this.activeUsers,data);
    if(user){
      socket.to(user.socketId).emit("recieve-message", data);
      // this.server.to(user.socketId).emit('recieve-message', data);
    }
    
    this.logger.log(`recieve-message ${data}`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id} and  ${client}`,  );
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id} and `, this.activeUsers);
  }
}
