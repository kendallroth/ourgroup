/** Authentication credentials */
export interface IAuthCredentials {
  email: string;
  password: string;
}

/** Authentication tokens */
export interface IAuthTokens {
  /** Authenticated account ID */
  accountId: string;
  /** When auth token expires (seconds) */
  expiresIn: number;
  /** Refresh JWT token */
  refreshToken: string;
  /** Authentication JWT token */
  token: string;
}

/** Email resend response */
export interface IEmailResendResponse {
  /** Expiry time for email (seconds) */
  expiry: number;
  /** Time to wait between requests (seconds) */
  wait: number;
}
