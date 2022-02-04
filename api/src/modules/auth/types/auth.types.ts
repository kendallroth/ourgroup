/** Authentication response */
export interface IAuthenticationResponse {
  /** JWT token expiry time (seconds) */
  expiresIn: number;
  /** JWT refresh token */
  refreshToken: string;
  /** JWT token */
  token: string;
  /** Authenticated account ID */
  accountId: string;
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
}

/** JWT verification workflow */
export interface IJwtValidation {
  email: string;
}

/** Password configuration */
export interface IPasswordConfig {
  /** Password hash digest algorithm */
  hashDigest: "sha512";
  /** Password hash key length */
  hashKeyLength: number;
  /** Number of hash rounds */
  hashRounds: number;
  /** Hash salt length */
  hashSaltSize: number;
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
