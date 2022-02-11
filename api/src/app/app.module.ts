import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Utilities
import { AccountModule } from "@modules/account/account.module";
import { AuthModule } from "@modules/auth/auth.module";
import { LogModule } from "@modules/log/log.module";
import { RequestLoggerMiddleware } from "@modules/log/middleware";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import appConfig from "./app.config";

@Module({
  imports: [
    // External modules
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot(),
    // Local modules
    AccountModule,
    AuthModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Request logging and correlation IDs should be applied to all routes
    consumer.apply(RequestLoggerMiddleware).forRoutes({ method: RequestMethod.ALL, path: "*" });
  }
}
