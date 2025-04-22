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
import { CustomLogger } from '../common/logger/custom-logger';

@WebSocketGateway({
  namespace: '/logs',
})
// OnGatewayDisconnect
export class MonitoringLogsGateway implements OnGatewayConnection {
  constructor(
    @Inject(forwardRef(() => MonitoringLogsService))
    private monitoringLogsService: MonitoringLogsService,
    private readonly customLogger: CustomLogger
  ) {
    this.customLogger.setContext('MonitoringLogsGateway');
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.customLogger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.customLogger.log(`Client disconnected: ${client.id}`);
    this.monitoringLogsService.stopStream();
  }

  @SubscribeMessage('streamLogs')
  handleStreamLogs(
    @MessageBody() containerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.monitoringLogsService.streamContainerLogs(containerId, client);
  }
}
