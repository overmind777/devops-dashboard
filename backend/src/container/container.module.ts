import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerGateway } from './container.gateway';
import * as Docker from 'dockerode';
import { CustomLoggerModule } from '../common/logger/custom-logger.module';

@Module({
  imports: [CustomLoggerModule],
  providers: [
    ContainerGateway,
    ContainerService,
    {
      provide: 'DOCKER_CLIENT',
      useFactory: () => new Docker({ socketPath: '/var/run/docker.sock' }),
    },
  ],
  exports: [ContainerService],
})
export class ContainerModule {}
