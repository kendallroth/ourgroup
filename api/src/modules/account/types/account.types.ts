export enum AccountType {
  /** Regular account created through registration */
  FULL = "full",
  /** Partial accounts are created anonymously (but can upgrade) */
  PARTIAL = "partial",
}

/** Account information (private) */
export interface IAccountPrivateInfo {
  id: string;
  createdAt: Date;
  email: string;
  name: string | null;
  verifiedAt: Date | null;
}

/** Account verification resend response */
export interface IAccountVerifyResendResponse {
  /** Expiry time for verification email (seconds) */
  expiry: number;
  /** Time to wait between requests */
  wait: number;
}
