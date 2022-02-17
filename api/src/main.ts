import chalk from "chalk";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

// Utilities
import { UncaughtExceptionFilter } from "@common/filters";
import { LoggerService } from "@modules/log/services";
import { AppModule } from "./app/app.module";

/** Bootstrap the NestJS application */
async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    // Source: https://docs.nestjs.com/techniques/logger#using-the-logger-for-application-logging
    // NOTE: Do not need to buffer logs initialized when overriding during creation!
    logger,
  });

  const configService = app.get(ConfigService);

  const webAppUrl = configService.get<string>("app.webAppUrl", "");
  app.enableCors({
    // Cache preflight response for 1 hour ('Access-Control-Max-Age' header)
    maxAge: 60 * 60,
    origin: [webAppUrl],
  });

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
