import { Inject, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { CustomLogger } from '../common/logger/custom-logger';

@Injectable()
export class MonitoringService {
  constructor(
    @Inject('DOCKER_CLIENT') private docker: Docker,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('MonitoringService');
  }

  async startContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.start();
    await this.findAllContainers();
    this.logger.log(`Starting container ${containerId}`);
  }

  async stopContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.stop();
    this.logger.log(`Stopping container ${containerId}`);
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
    console.log(detailed);

    return detailed;
  }
}
