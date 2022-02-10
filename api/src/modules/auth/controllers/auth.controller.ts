import { Body, Controller, Request, Post, UseGuards, Patch } from "@nestjs/common";

// Utilities
import { JwtAuthGuard, LocalAuthGuard } from "@common/guards";
import { AuthService, ForgotPasswordService, RefreshTokenService } from "../services";

// Types
import { AuthenticatedRequest } from "@common/types";
import {
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  IAuthenticationResponse,
  RefreshTokenDto,
  IEmailResendResponse,
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
  async authLogin(@Request() req: AuthenticatedRequest): Promise<IAuthenticationResponse> {
    return this.authService.login(req.account);
  }

  /** Change authenticated account's password */
  @UseGuards(JwtAuthGuard)
  @Patch("/password/change")
  async changePassword(
    @Body() payload: ChangePasswordDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.authService.changePassword(req.account, payload);
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
  async refreshToken(@Body() payload: RefreshTokenDto): Promise<IAuthenticationResponse> {
    return this.refreshTokenService.refreshAuthToken(payload);
  }
}
