import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ContainerService } from './container.service';
import { Server } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'containers',
})
export class ContainerGateway {
  constructor(
    @Inject(forwardRef(() => ContainerService))
    private containerService: ContainerService,
  ) {
    ContainerGateway.instance = this;
  }

  static instance: ContainerGateway;

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findAllContainers')
  async findAllContainers() {
    const result = await this.containerService.findAllContainers();
    return {
      event: 'findAllContainers',
      data: result,
    };
  }

  @SubscribeMessage('startContainer')
  async startContainer(@MessageBody() containerId: string) {
    try {
      await this.containerService.startContainer(containerId);
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
      await this.containerService.stopContainer(containerId);
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
    const containers = await this.containerService.findAllContainers();
    this.server.emit('findAllContainers', containers);
  }
}
