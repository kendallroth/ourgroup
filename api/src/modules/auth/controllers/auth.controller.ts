import { Body, Controller, Post, UseGuards, Patch, Delete } from "@nestjs/common";

// Utilities
import { RequestAccount } from "@common/decorators";
import { AccountAuthenticatedGuard, LocalAuthGuard } from "@common/guards";
import { Account } from "@modules/account/entities";
import { AuthService, ForgotPasswordService, RefreshTokenService } from "../services";

// Types
import {
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  IAuthenticationResponse,
  RefreshTokenDto,
  IEmailResendResponse,
  RefreshTokenRevokeDto,
} from "../types";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /** Authentication login */
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async authLogin(@RequestAccount() account: Account): Promise<IAuthenticationResponse> {
    return this.authService.login(account);
  }

  /** Change authenticated account's password */
  @UseGuards(AccountAuthenticatedGuard)
  @Patch("/password/change")
  async changePassword(
    @Body() payload: ChangePasswordDto,
    @RequestAccount() account: Account,
  ): Promise<void> {
    return this.authService.changePassword(account, payload);
  }

  /** Forgot password request */
  @Post("/password/forget")
  async forgotPasswordRequest(
    @Body() payload: ForgotPasswordRequestDto,
  ): Promise<IEmailResendResponse> {
    return this.forgotPasswordService.forgotPasswordRequest(payload);
  }

  /** Forgot password reset (after email code verification) */
  @Post("/password/reset")
  async forgotPasswordReset(@Body() payload: ForgotPasswordResetDto): Promise<void> {
    return this.forgotPasswordService.forgotPasswordReset(payload);
  }

  /** Refresh account's auth token using refresh token */
  @Post("/refresh-token")
  async refreshTokenGet(@Body() payload: RefreshTokenDto): Promise<IAuthenticationResponse> {
    return this.refreshTokenService.refreshAuthToken(payload);
  }

  /** Ensure a refresh token is revoked */
  @Delete("/refresh-token")
  async refreshTokenDelete(@Body() payload: RefreshTokenRevokeDto): Promise<void> {
    return this.refreshTokenService.revokeRefreshToken(payload);
  }
}
