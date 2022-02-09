import { Body, Controller, Get, Patch, Post, Request, UseGuards } from "@nestjs/common";

// Utilities
import { AuthenticatedRequest } from "@common/types";
import { JwtAuthGuard } from "@common/guards";
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
  @UseGuards(JwtAuthGuard)
  @Get("/")
  async getAccountInfo(@Request() req: AuthenticatedRequest): Promise<IAccountPrivateInfo> {
    return this.accountService.getPrivateProfile(req.account);
  }

  /** Update current authenticated account information */
  @UseGuards(JwtAuthGuard)
  @Patch("/")
  async updateAccountInfo(
    @Request() req: AuthenticatedRequest,
    @Body() payload: AccountUpdateDto,
  ): Promise<IAccountPrivateInfo> {
    return this.accountService.updateProfile(req.account, payload);
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
