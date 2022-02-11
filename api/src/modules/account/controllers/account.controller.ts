import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";

// Utilities
import { RequestAccount } from "@common/decorators";
import { AccountAuthenticatedGuard } from "@common/guards";
import { Account } from "../entities";
import { AccountService } from "../services";

// Types
import { IAuthenticationResponse } from "@modules/auth/types";
import {
  AccountCreateDto,
  AccountUpdateDto,
  AccountVerifyDto,
  AccountVerifyResendDto,
  IAccountPrivateInfo,
  IAccountVerifyResendResponse,
} from "../types";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /** Get current authenticated account information */
  @UseGuards(AccountAuthenticatedGuard)
  @Get("/")
  async getAccountInfo(@RequestAccount() account: Account): Promise<IAccountPrivateInfo> {
    return this.accountService.getPrivateProfile(account);
  }

  /** Update current authenticated account information */
  @UseGuards(AccountAuthenticatedGuard)
  @Patch("/")
  async updateAccountInfo(
    @Body() payload: AccountUpdateDto,
    @RequestAccount() account: Account,
  ): Promise<IAccountPrivateInfo> {
    return this.accountService.updateProfile(account, payload);
  }

  /** Create a new account */
  @Post("/")
  async createAccount(@Body() payload: AccountCreateDto): Promise<IAuthenticationResponse> {
    return this.accountService.createAccount(payload);
  }

  /** Verify a registered account */
  @Patch("/verify")
  async verifyAccount(@Body() payload: AccountVerifyDto): Promise<IAuthenticationResponse> {
    return this.accountService.verifyAccount(payload);
  }

  /** Resend account verification email */
  @Post("/verify/resend")
  async verifyAccountResend(
    @Body() payload: AccountVerifyResendDto,
  ): Promise<IAccountVerifyResendResponse> {
    return this.accountService.verifyAccountResend(payload);
  }
}
