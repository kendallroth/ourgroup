// Utilities
import { useAccountStore } from "@store";
import ApiService from "./api.service";

// Types
import { IAuthCredentials, IAuthTokens } from "@typings/auth.types";

const AUTH_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCOUNT_ID_KEY = "userId";

class AuthService {
  /** Authenticated account ID */
  accountId: string | null = null;
  /** Authentication JWT token */
  authToken: string | null = null;
  /** Authentication refresh token */
  refreshToken: string | null = null;
  /** Ongoing refresh token call (to prevent generating multiple refresh token calls) */
  refreshCall: Promise<void> | null = null;

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

  /**
   * Load stored authentication tokens
   */
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
   */
  async logout(): Promise<void> {
    // Clean up authentication tokens
    this.removeAuthTokens();

    const accountStore = useAccountStore();
    accountStore.clearAccount();

    // TODO: Revoke current refresh token
  }

  /**
   * Refresh authentication tokens
   *
   * TODO: Investigate refreshing every so often
   * @returns Reference to ongoing refresh tokens API call
   */
  async refreshTokens(): Promise<void> {
    // Ignoring previous refresh call would invalidate that access token when the second request
    //   went through, causing another authentication error (voiding benefit entirely)!
    if (this.refreshCall) return this.refreshCall;

    // TODO: Refresh token and possibly start cycle until next refresh

    this.refreshCall = ApiService.api
      .post("/auth/refresh-token", {
        refreshToken: this.refreshToken,
        userId: this.accountId,
      })
      .then((response) => this.setAuthTokens(response.data))
      .catch((e) => {
        // TODO: Determine if we want to handle at all?
        throw e;
      })
      .finally(() => {
        this.refreshCall = null;
      });

    return this.refreshCall;
  }

  /**
   * Remove authentication tokens
   *
   * NOTE: Tokens are stored in memory and local storage
   */
  removeAuthTokens(): void {
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
  }
}

const singleton = new AuthService();
export default singleton;