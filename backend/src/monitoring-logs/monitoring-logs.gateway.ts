import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { MonitoringLogsService } from './monitoring-logs.service';

@WebSocketGateway({
  namespace: '/logs',
})
// OnGatewayDisconnect
export class MonitoringLogsGateway implements OnGatewayConnection {
  constructor(
    @Inject(forwardRef(() => MonitoringLogsService))
    private monitoringLogsService: MonitoringLogsService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // handleDisconnect(client: Socket) {
  //   console.log(`Client disconnected: ${client.id}`);
  //   this.monitoringLogsService.stopStream(client.id);
  // }

  @SubscribeMessage('streamLogs')
  handleStreamLogs(
    @MessageBody() containerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.monitoringLogsService.streamContainerLogs(containerId, client);
  }
}
