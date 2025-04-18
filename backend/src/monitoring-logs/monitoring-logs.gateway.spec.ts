import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringLogsGateway } from './monitoring-logs.gateway';
import { MonitoringLogsService } from './monitoring-logs.service';

describe('MonitoringLogsGateway', () => {
  let gateway: MonitoringLogsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringLogsGateway, MonitoringLogsService],
    }).compile();

    gateway = module.get<MonitoringLogsGateway>(MonitoringLogsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
