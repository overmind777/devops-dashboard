import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MonitoringService } from './monitoring.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'monitoring',
})
export class MonitoringGateway implements OnModuleInit {
  constructor(private readonly monitoringService: MonitoringService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit(): any {
    this.server.on('connection', (socket) => {
      console.log('Connected to Monitoring');
    });
  }

  @SubscribeMessage('findAllContainers')
  async findAllContainers() {
    const result = await this.monitoringService.findAllContainers();
    return {
      event: 'findAllContainers',
      data: result,
    };
  }

  @SubscribeMessage('updateContainer')
  async updateContainer(@MessageBody() containerId: string) {
    const result = await this.monitoringService.updateContainer(containerId);
    return {
      event: 'updateContainer',
      data: result,
    };
  }

  @SubscribeMessage('startContainer')
  async startContainer(@MessageBody() containerId: string) {
    try {
      await this.monitoringService.startContainer(containerId);
      return { event: 'containerStarted', data: await this.findAllContainers() };
    } catch (error) {
      return {
        event: 'error',
        data: `Container was not start: ${error.message}`,
      };
    }
  }

  @SubscribeMessage('stopContainer')
  async stopContainer(@MessageBody() containerId: string) {
    console.log('stop container');
    try {
      await this.monitoringService.stopContainer(containerId);
      return { event: 'containerStopped', data: `containerId=${containerId}` };
    } catch (error) {
      return {
        event: 'error',
        data: `Container was not stopped: ${error.message}`,
      };
    }
  }
}
