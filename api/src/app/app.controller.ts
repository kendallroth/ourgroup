import { Controller, Get } from "@nestjs/common";

// Utilities
import { AppService } from "./app.service";

// Types
import { IApiInfo } from "./types";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Basic API information */
  @Get("/")
  getInfo(): IApiInfo {
    return this.appService.getInfo();
  }

  /** Health check route */
  @Get("/health")
  getHealth(): void {
    return;
  }
}
