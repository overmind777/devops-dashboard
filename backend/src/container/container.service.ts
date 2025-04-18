import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Docker from 'dockerode';
import { CustomLogger } from '../common/logger/custom-logger';
import { ContainerGateway } from './container.gateway';

@Injectable()
export class ContainerService implements OnModuleInit {
  constructor(
    @Inject('DOCKER_CLIENT') private docker: Docker,
    @Inject(forwardRef(() => ContainerGateway))
    private readonly gateway: ContainerGateway,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('containerService');
  }

  onModuleInit() {
    this.listenToDockerEvents();
  }

  private async listenToDockerEvents() {
    const stream = await this.docker.getEvents();

    stream.on('data', async (chunk) => {
      try {
        const event = JSON.parse(chunk.toString());
        if (event.Type === 'container') {
          this.logger.log(
            `Docker Event: ${event.Action} for container ${event.id}`,
          );
        }

        await this.gateway.emitAllContainers();
      } catch (error) {
        this.logger.error('Error parsing Docker event', error);
      }
    });
  }

  async startContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.start();
    this.logger.log(`Starting container ${containerId}`);
    return await this.updateContainer(containerId);
  }

  async stopContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.stop();
    this.logger.log(`Stopping container ${containerId}`);
    return await this.updateContainer(containerId);
  }

  async findAllContainers() {
    const containers = await this.docker.listContainers({ all: true });

    const detailed = await Promise.all(
      containers.map(async (containerInfo) => {
        const container = this.docker.getContainer(containerInfo.Id);
        const data = await container.inspect();
        return {
          id: containerInfo.Id,
          name: data.Name,
          image: data.Config.Image,
          state: data.State,
          status: data.State.Status,
          ports: data.NetworkSettings.Ports,
        };
      }),
    );

    this.logger.log('Return all detailed');
    return detailed;
  }

  async updateContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    const data = await container.inspect();
    return {
      id: container.id,
      name: data.Name,
      image: data.Config.Image,
      state: data.State,
      status: data.State.Status,
      ports: data.NetworkSettings.Ports,
    };
  }
}
