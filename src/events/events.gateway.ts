import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { activeUsers } from './onLineMap';

@WebSocketGateway(8800, {
  cors:{
    origin:'*' //http://localhost:3000
  }
})
export class EventsGateway {
  @WebSocketServer()
  server:Server;

  @SubscribeMessage('new-user-add')
  findAll(@MessageBody('nweUserId') newUserId: any,
   @ConnectedSocket() socket:Socket) {
    
    if(!activeUsers.some((user)=>user.userId === newUserId)){
      activeUsers.push({userId: newUserId, socketId: socket.id});
    }

    //return { event: 'get-users', data: activeUsers }
    socket.emit('get-users', activeUsers);
    
  }

  @SubscribeMessage('send-message')
  async identity(@MessageBody() data: any,
  @ConnectedSocket() socket:Socket) {
    const {receiverId} =data;
    const user = activeUsers.find((user)=>user.userId === receiverId);
    if(user){
      socket.to(user.socketId).emit("recieve-message", data)
    }
    
  }
}
