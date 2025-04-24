import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { CustomLogger } from '../common/logger/custom-logger';
import { ContainerGateway } from './container.gateway';

@Injectable()
export class ContainerService {
  constructor(
    @Inject('DOCKER_CLIENT') private docker: Docker,
    @Inject(forwardRef(() => ContainerGateway))
    private readonly gateway: ContainerGateway,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('containerService');
  }

  private readonly statsStreams = new Map<string, NodeJS.ReadableStream>();

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

  // async getContainerStats(containerId: string) {
  //   const container = this.docker.getContainer(containerId);
  //
  //   const stream = await container.stats({ stream: true });
  //
  //   return new Promise((resolve, reject) => {
  //     stream.on('data', (err, stats) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       const cpuDelta =
  //         stats.cpu_stats.cpu_usage.total_usage -
  //         stats.precpu_stats.cpu_usage.total_usage;
  //       const systemDelta =
  //         stats.cpu_stats.system_cpu_usage -
  //         stats.precpu_stats.system_cpu_usage;
  //       const cpuUsage =
  //         (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
  //       const memoryUsage = stats.memory_stats.usage / (1024 * 1024);
  //       const memoryLimit = stats.memory_stats.limit / (1024 * 1024);
  //       const memoryPercent = (memoryUsage / memoryLimit) * 100;
  //
  //       resolve({
  //         cpu: Number(cpuUsage.toFixed(2)),
  //         memory: Number(memoryUsage.toFixed(2)),
  //         memoryPercent: Number(memoryPercent.toFixed(2)),
  //       });
  //     });
  //   });
  // }

  startStatsStream(containerId: string, socket: any) {
    const container = this.docker.getContainer(containerId);

    container.stats({ stream: true }).then((stream) => {
      this.statsStreams.set(socket.id, stream);

      let buffer = '';

      stream.on('data', (chunk) => {
        buffer += chunk.toString();
        try {
          const stats = JSON.parse(buffer);

          const cpuDelta =
            stats.cpu_stats.cpu_usage.total_usage -
            stats.precpu_stats.cpu_usage.total_usage;
          const systemDelta =
            stats.cpu_stats.system_cpu_usage -
            stats.precpu_stats.system_cpu_usage;
          const cpuUsage =
            (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

          const memoryUsage = stats.memory_stats.usage / (1024 * 1024);
          const memoryLimit = stats.memory_stats.limit / (1024 * 1024);
          const memoryPercent = (memoryUsage / memoryLimit) * 100;

          socket.emit('containerStats', {
            cpu: Number(cpuUsage.toFixed(2)),
            memory: Number(memoryUsage.toFixed(2)),
            memoryPercent: Number(memoryPercent.toFixed(2)),
          });

          buffer = '';
        } catch (err) {
          console.log(err);
        }
      });

      stream.on('error', (err) => {
        this.logger.error(`Stream error: ${err.message}`);
      });
    });
  }

  stopStatsStream(socketId: string) {
    const stream = this.statsStreams.get(socketId);
    if (stream) {
      stream.once('disconnect', () => {
        console.log('disconnect');
      });
      this.statsStreams.delete(socketId);
      this.logger.log(`Stopped stats stream for socket ${socketId}`);
    }
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
