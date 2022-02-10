// Utilities
import ApiService from "./api.service";
import AuthService from "./auth.service";

// Types
import { IAuthTokens, IEmailResendResponse } from "@typings/auth.types";
import { IAuthAccount, IAccountCreate } from "@typings/account.types";

class AccountService {
  /**
   * Create a new account
   *
   * @param account - Account registration information
   */
  async createAccount(account: IAccountCreate): Promise<void> {
    const response = await ApiService.api.post("/account", account);
    const tokens: IAuthTokens = response.data;

    AuthService.setAuthTokens(tokens);
  }

  /**
   * Fetch authenticated account information
   *
   * @returns Authenticated account information
   */
  async fetchAccount(): Promise<IAuthAccount> {
    const response = await ApiService.api.get("/account");
    const account = response.data;

    // TODO: Determine where we store in Redux (or if?)

    return {
      email: account.email,
      name: account.name ?? null,
      accountId: account.accountId,
      verifiedAt: account.verifiedAt ?? null,
    };
  }

  /**
   * Verify newly registered account
   *
   * @param code - Verification code (from email)
   */
  async verifyAccount(code: string): Promise<void> {
    const response = await ApiService.api.patch("/account/verify", { code });
    const tokens: IAuthTokens = response.data;

    AuthService.setAuthTokens(tokens);
  }

  /**
   * Resend account verification code
   *
   * @param email - Email from target account
   */
  async verifyAccountResend(email: string): Promise<IEmailResendResponse> {
    const response = await ApiService.api.post("/account/verify/resend", { email });
    return response.data;
  }
}

const singleton = new AccountService();
export default singleton;
