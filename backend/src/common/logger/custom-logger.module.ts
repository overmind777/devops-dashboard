import { Module } from '@nestjs/common';
import { CustomLogger } from './custom-logger';

@Module({
  exports: [CustomLogger],
  providers: [CustomLogger],
})
export class CustomLoggerModule {}
