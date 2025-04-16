import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringGateway } from './monitoring.gateway';
import * as Docker from 'dockerode';
import { CustomLoggerModule } from '../common/logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  providers: [
    MonitoringGateway,
    MonitoringService,
    {
      provide: 'DOCKER_CLIENT',
      useFactory: () => new Docker({ socketPath: '/var/run/docker.sock' }),
    },
  ],
  exports: [MonitoringService],
})
export class MonitoringModule {}
