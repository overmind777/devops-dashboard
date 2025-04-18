import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContainerModule } from './container/container.module';
import { MonitoringLogsModule } from './monitoring-logs/monitoring-logs.module';

@Module({
  imports: [ContainerModule, MonitoringLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
