import { Inject, Injectable } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class MonitoringService {
  constructor(@Inject('DOCKER_CLIENT') private docker: Docker) {}

  async startContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.start();
  }

  async stopContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.stop();
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

    return detailed;
  }
}
