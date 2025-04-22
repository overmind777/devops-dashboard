import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { CustomLogger } from '../common/logger/custom-logger';
import { MonitoringLogsGateway } from './monitoring-logs.gateway';
import { Readable, PassThrough } from 'stream';
import { Socket } from 'socket.io';

@Injectable()
export class MonitoringLogsService {
  private activeStreams = new Map<string, Readable>();

  constructor(
    @Inject('DOCKER_CLIENT') private docker: Docker,
    @Inject(forwardRef(() => MonitoringLogsGateway))
    private readonly gateway: MonitoringLogsGateway,
    private readonly customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('MonitoringLogsService');
  }

  async streamContainerLogs(containerId: string, client: Socket) {
    const container = this.docker.getContainer(containerId);
    const logStream = new PassThrough();

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
        tail: 100,
      },
      (err, stream) => {
        if (err) {
          this.customLogger.error(err.message);
          client.emit('error', `Stream error: ${err.message}`);
          return;
        }

        const readable = stream as Readable;

        this.activeStreams.set(client.id, readable);

        logStream.on('data', (chunk: Buffer) => {
          client.emit('logs', {
            containerId,
            log: chunk.toString('utf8'),
          });
        });

        container.modem.demuxStream(stream, logStream, logStream);

        stream.on('end', () => {
          logStream.end();
          client.emit('logs', {
            containerId,
            log: '[Log stream ended]',
          });
        });

        stream.on('error', (err) => {
          this.customLogger.error(err.message);
          client.emit('logs', {
            containerId,
            log: `[Stream error]: ${err.message}`,
          });
        });

        setTimeout(() => {
          readable.destroy();
          this.activeStreams.delete(client.id);
        }, 2000);
      },
    );

    client.on('disconnect', () => {
      const active = this.activeStreams.get(client.id);
      if (active) {
        active.destroy();
        this.activeStreams.delete(client.id);
        this.customLogger.log(
          `Disconnected and destroyed stream for client ${client.id}`,
        );
      }
    });
  }

  async stopStream() {
    await this.activeStreams.clear();
  }
}
