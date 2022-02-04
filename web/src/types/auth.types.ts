/** Authentication credentials */
export interface IAuthCredentials {
  email: string;
  password: string;
}

/** Authentication tokens */
export interface IAuthTokens {
  /** Refresh JWT token */
  refreshToken: string;
  /** Authentication JWT token */
  token: string;
  /** Authenticated account ID */
  accountId: string;
}

/** Email resend response */
export interface IEmailResendResponse {
  /** Expiry time for verification email (seconds) */
  expiry: number;
  /** Time to wait between requests */
  wait: number;
}
