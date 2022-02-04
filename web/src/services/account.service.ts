// Utilities
import ApiService from "./api.service";
import AuthService from "./auth.service";

// Types
import { IAuthTokens } from "@typings/auth.types";
import { IAuthAccount, IAccountCreate } from "@typings/account.types";

class AccountService {
  /**
   * Fetch authenticated account information
   *
   * @returns Authenticated account information
   */
  async fetchAccount(): Promise<IAuthAccount> {
    const response = await ApiService.api.get("/account");
    const account = response.data;

    // TODO: Determine where we store in Redux

    return {
      email: account.email,
      name: account.name ?? null,
      id: account.id,
      verifiedAt: account.verifiedAt ?? null,
    };
  }

  /**
   * Create a new account
   *
   * @param account - Account registration information
   */
  async register(account: IAccountCreate): Promise<void> {
    const response = await ApiService.api.post("/account", account);
    const tokens: IAuthTokens = response.data;

    AuthService.setAuthTokens(tokens);
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
}

const singleton = new AccountService();
export default singleton;