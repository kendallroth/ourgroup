import { Request } from "express";

// Utilities
import { Account } from "@modules/account/entities";

/**
 * Authenticated API request
 *
 * NOTE: Requires a controller guard to set "req.account"!
 */
export interface IAuthenticatedRequest extends Request {
  /** Authenticated account/user (from JWT) */
  account: Account;
}

/**
 * Request with loggable request ID
 *
 * NOTE: Requires request ID to be set by global middleware
 */
export interface ILoggedRequest extends Request {
  /** Request correlation ID */
  requestId: string;
}
