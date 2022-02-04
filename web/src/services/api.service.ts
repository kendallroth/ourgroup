import axios, { AxiosInstance, HeadersDefaults } from "axios";
import HttpStatus from "http-status-codes";
import qs from "qs";

// Utilities
import config from "@config";
import router from "@router";
import { sleep } from "@utilities/sleep.util";
import AuthService from "./auth.service";

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string | null;
}

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

    // Intercept and handle authentication errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => this.interceptErrors(error),
    );
  }

  /**
   * Get API info
   */
  async getApiInfo(): Promise<any> {
    const response = await this.api.get("/");
    await sleep(1000);
    return response.data;
  }

  /**
   * Intercept Axios errors and check for authentication problems
   *
   * @param   error - Axios response error
   * @returns Axios response chain
   */
  async interceptErrors(error: any): Promise<any> {
    const status = error.response?.status ?? null;

    if (status !== HttpStatus.UNAUTHORIZED) {
      return Promise.reject(error);
    }

    // Only try refreshing the auth token if user had a previous authentication token
    if (!AuthService.hasAuthTokens()) {
      return Promise.reject(error);
    }

    try {
      await AuthService.refreshTokens();

      // Retry original request (after refreshing auth tokens) by copying config
      const retryConfig = {
        ...error.config,
        headers: {
          ...error.config.headers,
          ...this.api.defaults.headers,
        },
      };

      return this.api(retryConfig);
    } catch (innerError: any) {
      // Only logout user if retry error was actually related to auth (and not just a failed request)
      const innerStatus = innerError.response?.status ?? null;
      if (innerStatus === HttpStatus.UNAUTHORIZED) {
        AuthService.logout();

        const { fullPath } = router.currentRoute.value;
        router.replace({
          path: "/login",
          query: { redirectUrl: fullPath },
        });

        return Promise.reject("Authentication has timed out");
      }

      return Promise.reject(innerError);
    }
  }

  /**
   * Remove Axios authentication token
   */
  removeAuthToken(): void {
    const headers = this.api.defaults.headers as CommonHeaderProperties;
    headers["Authorization"] = null;
  }

  /**
   * Set Axios authentication token
   *
   * @param token - Authentication header token
   */
  setAuthToken(token: string): void {
    const headers = this.api.defaults.headers as CommonHeaderProperties;
    headers["Authorization"] = `Bearer ${token}`;
  }
}

const singleton = new ApiService();
export default singleton;
