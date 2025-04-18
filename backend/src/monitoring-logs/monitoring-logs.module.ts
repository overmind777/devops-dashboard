import { Module } from '@nestjs/common';
import { MonitoringLogsService } from './monitoring-logs.service';
import { MonitoringLogsGateway } from './monitoring-logs.gateway';
import * as Docker from 'dockerode';
import { CustomLoggerModule } from '../common/logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  providers: [
    MonitoringLogsGateway,
    MonitoringLogsService,
    {
      provide: 'DOCKER_CLIENT',
      useFactory: () => new Docker({ socketPath: '/var/run/docker.sock' }),
    },
  ],
  exports: [MonitoringLogsService],
})
export class MonitoringLogsModule {}
