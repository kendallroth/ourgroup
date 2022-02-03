import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

/**
 * Exception filter to log uncaught exceptions in LogDNA
 *
 * Source: https://docs.nestjs.com/exception-filters#inheritance
 */
@Catch()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;

    // Uncaught exceptions should have a bit of extra logging
    // NOTE: Assumes that all errors NOT inheriting from 'HttpException' are uncaught!
    if (!isHttpException) {
      // TODO: Figure out how to handle this
      // eslint-disable-next-line no-console
      console.log("[UncaughtFilter]: Uncaught error thrown");
    }

    super.catch(exception, host);
  }
}
