import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleLog(data: any): void;
}
