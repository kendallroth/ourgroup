// Utilities
import { useAccountStore } from "@store";
import ApiService, { createApiInstance } from "./api.service";

// Types
import { IAuthCredentials, IAuthTokens } from "@typings/auth.types";

const AUTH_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCOUNT_ID_KEY = "accountId";

class AuthService {
  /** Authenticated account ID */
  accountId: string | null = null;
  /** Authentication JWT token */
  authToken: string | null = null;
  /** Authentication refresh token */
  refreshToken: string | null = null;
  /** Timeout/interval for auto-refreshing auth tokens */
  refreshTokenTimeout?: number;
  /** Ongoing refresh token call (to prevent generating multiple refresh token calls) */
  refreshCall: Promise<void> | null = null;

  constructor() {
    // Ensure auth token refresh cycle is cleaned up
    window.addEventListener("beforeunload", () => {
      this.clearRefreshTokenTimeout();
    });
  }

  /** Clear automatated refresh token cycle timeout */
  private clearRefreshTokenTimeout() {
    clearTimeout(this.refreshTokenTimeout);
  }

  /**
   * Determine whether user is authenticated
   *
   * @returns Whether user is authenticated
   */
  hasAuthTokens(): boolean {
    if (this.authToken && this.refreshToken && this.accountId) {
      ApiService.setAuthToken(this.authToken);
      return true;
    }

    // Load authentication if not already loaded
    this.loadAuth();

    const hasAuth = Boolean(this.authToken && this.refreshToken && this.accountId);
    if (hasAuth && this.authToken) {
      ApiService.setAuthToken(this.authToken);
    }

    return hasAuth;
  }

  /** Load stored authentication tokens */
  loadAuth(): void {
    this.authToken = localStorage.getItem(AUTH_TOKEN_KEY) ?? null;
    this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? null;
    this.accountId = localStorage.getItem(ACCOUNT_ID_KEY) ?? null;
  }

  /**
   * Log user in via credentials
   *
   * @param credentials - User credentials
   */
  async login(credentials: IAuthCredentials): Promise<void> {
    const response = await ApiService.api.post("/auth/login", credentials);
    const tokens: IAuthTokens = response.data;

    this.setAuthTokens(tokens);
  }

  /**
   * Logout authenticated user and clean up state
   *
   * NOTE: Only cleans up app state and avoids any routing, as it may be called
   *         from various places, including logout screen!
   */
  async logout(): Promise<void> {
    // Revoke/clean up authentication tokens
    this.removeAuthTokens();

    const accountStore = useAccountStore();
    accountStore.clearAccount();
  }

  /**
   * Refresh authentication tokens
   *
   * Auth tokens are automatically refreshed periodically through an automatic
   *   cycle, although any errors during this process are ignored.
   *
   * @returns Reference to ongoing refresh tokens API call
   */
  async refreshTokens(): Promise<void> {
    // Ignoring previous refresh call would invalidate that access token when the second request
    //   went through, causing another authentication error (voiding benefit entirely)!
    if (this.refreshCall) return this.refreshCall;

    // Avoid the ApiService axios instance to ensure that interceptors are not fired,
    //   which could trigger an infinite loop IF the API was ever updated to use a
    //   "Not Authenticated" status for invalid refresh tokens (future proof).
    const refreshTokenApi = createApiInstance();
    this.refreshCall = refreshTokenApi
      .post("/auth/refresh-token", {
        accountId: this.accountId,
        refreshToken: this.refreshToken,
      })
      .then((response) => {
        // Automatic refresh calls are eventually disabled after enough consecutive
        //   refresh token calls without any other API activity in between.
        ApiService.refreshCallsSinceLastApiCall++;
        return this.setAuthTokens(response.data);
      })
      .catch((e) => {
        // Callers should handle any errors as appropriate, which may not be always...
        throw e;
      })
      .finally(() => {
        this.refreshCall = null;
      });

    return this.refreshCall;
  }

  /**
   * Revoke/invalidate refresh tokens
   *
   * NOTE: Does not necessarily need to be awaited (errors are handled silently)!
   */
  async revokeAuthTokens(): Promise<void> {
    if (!this.accountId || !this.refreshToken) return;

    try {
      await ApiService.api.delete("/auth/refresh-token", {
        data: {
          accountId: this.accountId,
          refreshToken: this.refreshToken,
        },
      });
    } catch {
      // NOTE: Revoking token errors can safely be ignored
    }
  }

  /**
   * Clean up local authentication tokens and revoke remote tokens
   *
   * NOTE: Tokens are stored in memory and local storage
   * NOTE: Does not necessarily need to be awaited (errors are handled silently)!
   */
  removeAuthTokens(): void {
    this.revokeAuthTokens().catch(() => {
      // NOTE: Do nothing
    });
    this.clearRefreshTokenTimeout();

    this.authToken = null;
    this.refreshToken = null;
    this.accountId = null;

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCOUNT_ID_KEY);

    // Clear Axios authorization header
    ApiService.removeAuthToken();
  }

  /**
   * Store authentication tokens
   *
   * NOTE: Tokens are stored in memory and local storage
   *
   * @param tokens - Authentication tokens
   */
  setAuthTokens(tokens: IAuthTokens): void {
    const { accountId, refreshToken, token } = tokens;

    this.accountId = accountId;
    this.authToken = token;
    this.refreshToken = refreshToken;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);

    // Set Axios authorization header
    ApiService.setAuthToken(token);

    // Restart automatic auth token refresh cycle
    this.setRefreshTokenTimeout(tokens.expiresIn);
  }

  /**
   * Set automated refresh token cycle timeout, after which auth tokens will automatically
   *   be refreshed to limit need for refreshing while handling authentication errors.
   *
   * @param seconds - Time before auto-refreshing auth tokens
   */
  private setRefreshTokenTimeout(seconds: number) {
    this.clearRefreshTokenTimeout();

    if (!seconds || seconds < 0) return;

    // Automatic refresh calls are eventually disabled after enough consecutive
    //   refresh token calls without any other API activity in between.
    if (ApiService.refreshCallsSinceLastApiCall > 2) return;

    // Refresh an auth token just before before it would expire
    const preExpiryLeeway = 5;
    const timeoutDelay = (seconds - preExpiryLeeway) * 1000;
    if (timeoutDelay <= 0) return;

    this.refreshTokenTimeout = window.setTimeout(() => {
      this.refreshTokens().catch(() => {
        // Errors while automatically refreshing auth token should not necessarily
        //   cause an error and force login, as this would disrupt user flow and
        //   will be caught/handled properly when user performs an authenticated action.
        console.log("Automatically refreshing auth token failed!");
      });
    }, timeoutDelay);
  }
}

const singleton = new AuthService();
export default singleton;
