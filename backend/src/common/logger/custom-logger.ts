import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  log(message: any, context?: string) {
    if (context) {
      super.log(message, context);
    } else {
      super.log(message);
    }
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }
}
