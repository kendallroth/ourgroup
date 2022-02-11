import { Global, Module } from "@nestjs/common";

// Utilities
import { LoggerService } from "./services";

@Global()
@Module({
  exports: [LoggerService],
  providers: [LoggerService],
})
export class LogModule {}
