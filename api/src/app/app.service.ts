import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

// Utilities
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

import _appConfig from "./app.config";

// Types
import { IApiInfo } from "./app.types";

@Injectable()
export class AppService {
  constructor(
    @Inject(_appConfig.KEY)
    private readonly appConfig: ConfigType<typeof _appConfig>,
  ) {}

  /**
   * Get basic API info (release data, version, etc)
   *
   * @returns Basic API information
   */
  getInfo(): IApiInfo {
    return {
      releaseDate: this.appConfig.releaseDate,
      releaseHash: this.appConfig.releaseHash,
      version,
    };
  }
}
