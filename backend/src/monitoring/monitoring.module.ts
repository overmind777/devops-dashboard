import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringGateway } from './monitoring.gateway';

@Module({
  providers: [MonitoringGateway, MonitoringService],
})
export class MonitoringModule {}
