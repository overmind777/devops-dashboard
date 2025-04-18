import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringLogDto } from './create-monitoring-log.dto';

export class UpdateMonitoringLogDto extends PartialType(CreateMonitoringLogDto) {
  id: number;
}
