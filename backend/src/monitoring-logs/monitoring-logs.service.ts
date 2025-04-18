import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { CustomLogger } from '../common/logger/custom-logger';
import { MonitoringLogsGateway } from './monitoring-logs.gateway';
import { Readable, Stream } from 'stream';
import { Socket } from 'socket.io';

// import * as stream from 'node:stream';

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
    let arr;
    const container = this.docker.getContainer(containerId);
    const logStream = new Stream.PassThrough();
    logStream.on('data', (chunk) => {
      arr.push(chunk.toString('utf8'));
    });

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
      },
      (err, stream) => {
        if (err) {
          this.customLogger.error(err);
        }
        const readable = stream as Readable;

        this.activeStreams.set(client.id, readable);

        container.modem.demuxStream(stream, logStream, logStream);

        stream.on('end', function () {
          logStream.end('!stop!');
        });

        setTimeout(function () {
          readable.destroy();
        }, 2000);
      },
    );
    console.log(arr);
    return arr;
  }
}
