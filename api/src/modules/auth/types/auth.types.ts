/** Authentication response */
export interface IAuthenticationResponse {
  /** Authenticated account ID */
  accountId: string;
  /** JWT token expiry time (seconds) */
  expiresIn: number;
  /** JWT refresh token */
  refreshToken: string;
  /** JWT token */
  token: string;
}

/** Email resend response */
export interface IEmailResendResponse {
  /** Expiry time for email (seconds) */
  expiry: number;
  /** Time to wait between requests (seconds) */
  wait: number;
}

/** JWT configuration */
export interface IJwtConfig {
  /** JWT expiry time (seconds) */
  jwtExpirySeconds: number;
  /** JWT secret */
  jwtSecret: string;
  /** Refresh token expiry time (seconds) */
  refreshTokenExpirySeconds: number;
  /** Refresh token length */
  refreshTokenLength: number;
  /** Refresh token hashing rounds */
  refreshTokenRounds: number;
}

/** JWT verification workflow */
export interface IJwtValidation {
  email: string;
}

/** Password configuration */
export interface IPasswordConfig {
  /** Number of hash rounds (bcrypt) */
  hashRounds: number;
  /** Number of hash salt rounds (bcrypt) */
  hashSaltRounds: number;
}

/** Verification code throttle (prevent generating rapidly) */
export interface IVerificationCodeThrottle {
  /** Required delay until throttling ends */
  delay: number;
  /** Whether enough time has elapsed to avoid throttling */
  valid: boolean;
}

/** Verification code config */
export interface IVerificationCodeConfig {
  /** Verification code generator */
  generator: () => string;
  /** Expiry time (seconds) */
  expiry: number;
}

/** Verification code type */
export enum VerificationCodeType {
  /** Account verification (initiated with registration) */
  ACCOUNT_VERIFICATION = "account_verification",
  /** Reset password workflow */
  PASSWORD_RESET = "password_reset",
}
