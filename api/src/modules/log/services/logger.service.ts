/**
 * NOTE: Because the custom logger is injected into NestJS as an override for
 *         default logger, the "default" function definitions must stay the same!
 *         Changing parameter order will result in Nest invoking this logger incorrectly!
 */

import dayjs from "dayjs";
import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";
import winston, { Logger as LoggerType, LoggerOptions } from "winston";

// Utilities
import { winstonConsoleFormatter } from "../utilities";

/**
 * Custom NestJS logger service based on WinstonJS.
 *
 * Logger should be injected per context (service, controller). Customizing the context
 *   is optional but provides valuable context (indicates origin).
 *
 * @example
 *   class SampleService {
 *     constructor(private logger: LoggerService) {
 *        this.logger.setContext("ContextName");
 *     }
 *   }
 *
 * @source https://docs.nestjs.com/techniques/logger#injecting-a-custom-logger
 * @source https://github.com/nestjs/nest/issues/507#issuecomment-374221089
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private logger: LoggerType;
  private static loggerOptions: LoggerOptions = {
    transports: [
      new winston.transports.Console({
        format: winstonConsoleFormatter,
        level: "debug",
      }),
    ],
  };

  /**
   * Create a new logger context
   *
   * @param context - Logger context (helps locate logs)
   */
  constructor(context?: string) {
    super();

    if (context) {
      this.setContext(context);
    }

    this.logger = winston.createLogger(LoggerService.loggerOptions);
  }

  /**
   * Debug level log
   *
   * @param message - Log message
   * @param context - Log context override (recommend to avoid)
   */
  debug(message: string, context?: string | undefined) {
    this.logger.debug(message, {
      context: context ?? this.context,
      timestamp: dayjs().toISOString(),
    });
  }

  /**
   * Error level log
   *
   * @param message - Log message
   * @param context - Log context override (recommend to avoid)
   */
  error(message: string, error?: Error | string | undefined, context?: string | undefined) {
    this.logger.error(message, {
      error,
      context: context ?? this.context,
      timestamp: dayjs().toISOString(),
    });
  }

  /**
   * Info level log
   *
   * @param message - Log message
   * @param context - Log context override (recommend to avoid)
   */
  log(message: string, context?: string | undefined) {
    this.logger.info(message, {
      context: context ?? this.context,
      timestamp: dayjs().toISOString(),
    });
  }

  /**
   * Warn level log
   *
   * @param message - Log message
   * @param context - Log context override (recommend to avoid)
   */
  warn(message: string, context?: string | undefined) {
    this.logger.warn(message, {
      context: context ?? this.context,
      timestamp: dayjs().toISOString(),
    });
  }
}
