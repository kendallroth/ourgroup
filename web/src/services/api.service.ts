import axios, { AxiosInstance } from "axios";
import qs from "qs";

// Utilities
import config from "@config";
import { sleep } from "@utilities/sleep.util";

class ApiService {
  /** API axios instance */
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "App-Version": config.app.version,
      },
      timeout: 10000,

      // Parameters are serialized to support arrays (bracket/repeated notation).
      // NOTE: This doesn't work with arrays of objects, which require "index" mode.
      //         However, since this is a slightly longer query is should be
      //         only used where appropriate (by overriding in request).
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
    });
  }

  /**
   * Get API info
   */
  async getApiInfo(): Promise<any> {
    const response = await this.api.get("/");
    await sleep(1000);
    return response.data;
  }
}

const singleton = new ApiService();
export default singleton;
