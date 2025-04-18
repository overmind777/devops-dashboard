import { Test, TestingModule } from '@nestjs/testing';
import { ContainerGateway } from './container.gateway';
import { MonitoringService } from './container.service';

describe('MonitoringGateway', () => {
  let gateway: ContainerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContainerGateway, MonitoringService],
    }).compile();

    gateway = module.get<ContainerGateway>(ContainerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
