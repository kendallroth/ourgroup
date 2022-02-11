import chalk from "chalk";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

// Utilities
import { UncaughtExceptionFilter } from "@common/filters";
import { CustomLogger } from "@modules/log/utilities";
import { AppModule } from "./app/app.module";

/** Bootstrap the NestJS application */
async function bootstrap() {
  const logger = new CustomLogger();
  const app = await NestFactory.create(AppModule, {
    // Buffer logs until logging module has been initialized
    bufferLogs: true,
  });

  // Source: https://docs.nestjs.com/techniques/logger#using-the-logger-for-application-logging
  app.useLogger(logger);

  app.enableCors();

  const configService = app.get(ConfigService);

  // Globally transform payload objects to match their TypeScript definition
  // Source: https://docs.nestjs.com/techniques/validation#transform-payload-objects
  app.useGlobalPipes(
    new ValidationPipe({
      // Prevent showing default error messages
      // dismissDefaultMessages: true,
      transform: true,
    }),
  );

  // Exception filter to log uncaught exceptions in LogDNA
  // Source: https://docs.nestjs.com/exception-filters#inheritance
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new UncaughtExceptionFilter(httpAdapter));

  const port = configService.get<number>("app.port", 3001);
  await app.listen(port);

  logger.log(`${chalk.yellow("⚡")} Listening on port ${port}`, "Bootstrap");
}

bootstrap();
