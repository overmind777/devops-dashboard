import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MonitoringService } from './monitoring.service';
import { Server } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'containers',
})
export class MonitoringGateway {
  constructor(
    @Inject(forwardRef(() => MonitoringService))
    private monitoringService: MonitoringService,
  ) {
    MonitoringGateway.instance = this;
  }

  static instance: MonitoringGateway;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findAllContainers')
  async findAllContainers() {
    const result = await this.monitoringService.findAllContainers();
    return {
      event: 'findAllContainers',
      data: result,
    };
  }

  @SubscribeMessage('startContainer')
  async startContainer(@MessageBody() containerId: string) {
    try {
      await this.monitoringService.startContainer(containerId);
      await this.emitAllContainers();
      return { event: 'startContainer', data: containerId };
    } catch (error) {
      return {
        event: 'error',
        data: `Container was not started: ${error.message}`,
      };
    }
  }

  @SubscribeMessage('stopContainer')
  async stopContainer(@MessageBody() containerId: string) {
    try {
      await this.monitoringService.stopContainer(containerId);
      await this.emitAllContainers();
      return { event: 'stopContainer', data: containerId };
    } catch (error) {
      return {
        event: 'error',
        data: `Container was not stopped: ${error.message}`,
      };
    }
  }

  async emitAllContainers() {
    const containers = await this.monitoringService.findAllContainers();
    this.server.emit('findAllContainers', containers);
  }
}
