// Utilities
import { Account } from "@modules/account/entities";

/** Authenticated API request */
export interface AuthenticatedRequest extends Request {
  /** Authenticated account/user (from JWT) */
  account: Account;
}
