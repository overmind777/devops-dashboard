import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MonitoringGateway implements OnModuleInit {
  constructor(private readonly monitoringService: MonitoringService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit(): any {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected to Monitoring');
    });
  }

  @SubscribeMessage('createMonitoring')
  create(@MessageBody() createMonitoringDto: CreateMonitoringDto) {
    return this.monitoringService.create(createMonitoringDto);
  }

  @SubscribeMessage('findAllMonitoring')
  findAll() {
    return this.monitoringService.findAll();
  }

  @SubscribeMessage('findOneMonitoring')
  findOne(@MessageBody() id: number) {
    return this.monitoringService.findOne(id);
  }

  @SubscribeMessage('updateMonitoring')
  update(@MessageBody() updateMonitoringDto: UpdateMonitoringDto) {
    return this.monitoringService.update(
      updateMonitoringDto.id,
      updateMonitoringDto,
    );
  }

  @SubscribeMessage('removeMonitoring')
  remove(@MessageBody() id: number) {
    return this.monitoringService.remove(id);
  }
}
