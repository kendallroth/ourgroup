import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

// Utilities
import { Account } from "@modules/account/entities";
import { AccountAuthenticatedGuard } from "./account-authenticated.guard";

/**
 * Ensure routes are protected against unverified accounts
 */
@Injectable()
export class AccountVerifiedGuard extends AccountAuthenticatedGuard {
  handleRequest<TAccount = any>(
    err: any,
    account: Account,
    info: any,
    context: any,
    status?: any,
  ): TAccount {
    super.handleRequest(err, account, info, context, status);

    if (!account) {
      throw new UnauthorizedException("Unauthorized");
    } else if (!account.verifiedAt) {
      throw new ForbiddenException("Account is not verified");
    }

    return account as any;
  }
}

/* eslint @typescript-eslint/no-explicit-any: off */
