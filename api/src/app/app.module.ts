import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Utilities
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import appConfig from "./config/app.config";

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
