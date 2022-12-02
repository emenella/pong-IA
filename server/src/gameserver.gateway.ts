import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";

@WebSocketGateway(80)
export class GameServer implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    clientConnected: number; 
    async handleConnection() {
        this.clientConnected++;
        this.server.emit('users', this.clientConnected);
      }
      async handleDisconnect() {
        this.clientConnected--;
        this.server.emit('users', this.clientConnected);
      }
}

