import { ArgumentsHost, Catch, HttpException, Logger } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

/**
 * Exception filter to log uncaught exceptions in LogDNA
 *
 * Source: https://docs.nestjs.com/exception-filters#inheritance
 */
@Catch()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger("UncaughtFilter");

  catch(exception: Error, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;

    // Uncaught exceptions should have a bit of extra logging
    // NOTE: Assumes that all errors NOT inheriting from 'HttpException' are uncaught!
    if (!isHttpException) {
      // TODO: Figure out how to handle this better
      this.logger.error(exception.message ?? "Uncaught error thrown", exception, "Uncaught Filter");
    }

    super.catch(exception, host);
  }
}
