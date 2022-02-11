import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

// Utilities
import { LoggerService } from "@modules/log/services";

/**
 * Exception filter to log uncaught exceptions in LogDNA
 *
 * Source: https://docs.nestjs.com/exception-filters#inheritance
 */
@Catch()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService("UncaughtFilter");

  catch(exception: Error, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;

    // Uncaught exceptions should have a bit of extra logging
    // NOTE: Assumes that all errors NOT inheriting from 'HttpException' are uncaught!
    if (!isHttpException) {
      // NOTE: This currently logs the error message twice (once manually and once by NestJS...)
      // TODO: Determine if the NestJS handling will be sufficient, as this may have
      //         been necessary previously because the NestJS logger was not customized?
      // this.logger.error(exception.message ?? "Uncaught error thrown", exception);
      this.logger.error(exception.message ?? "Uncaught error thrown");
    }

    super.catch(exception, host);
  }
}
