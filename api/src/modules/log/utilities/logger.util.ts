import dayjs from "dayjs";
import { ConsoleLogger } from "@nestjs/common";
import winston, { Logger as LoggerType, LoggerOptions } from "winston";

// Utilities
import { winstonConsoleFormatter } from "./winston-console-formatter.util";

/**
 * Custom NestJS logger service based on WinstonJS.
 *
 * Logger should be instantiated per context (service, controller).
 *
 * @example
 *   class SampleService {
 *     private readonly logger = new Logger("ContextName");
 *   }
 *
 * @source https://github.com/nestjs/nest/issues/507#issuecomment-374221089
 */
export class CustomLogger extends ConsoleLogger {
  private contextOverride: string | null = null;

  private logger: LoggerType;
  private static loggerOptions: LoggerOptions = {
    transports: [
      new winston.transports.Console({
        format: winstonConsoleFormatter,
      }),
    ],
  };

  constructor() {
    super();

    this.logger = winston.createLogger(CustomLogger.loggerOptions);
  }

  error(message: string, stack?: string | undefined, context?: string | undefined) {
    this.logger.error(message, {
      error: stack,
      context: this.contextOverride ?? context,
      timestamp: dayjs().toISOString(),
    });
  }

  log(message: string, context?: string | undefined) {
    this.logger.info(message, {
      context: this.contextOverride ?? context,
      timestamp: dayjs().toISOString(),
    });
  }

  warn(message: string, context?: string | undefined) {
    this.logger.warn(message, {
      context: this.contextOverride ?? context,
      timestamp: dayjs().toISOString(),
    });
  }
}
