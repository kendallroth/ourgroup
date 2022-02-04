import { Body, Controller, Request, Post, UseGuards, Patch } from "@nestjs/common";

// Utilities
import { JwtAuthGuard } from "@common/guards";
import { AuthService, ForgotPasswordService, RefreshTokenService } from "../services";

// Types
import { AuthenticatedRequest } from "@common/types";
import {
  AuthLoginDto,
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  IForgotPasswordResponse,
  IAuthenticationResponse,
  RefreshTokenDto,
} from "../types";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /** Authentication login */
  @Post("/login")
  async authLogin(@Body() payload: AuthLoginDto): Promise<IAuthenticationResponse> {
    return this.authService.login(payload);
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
  ): Promise<IForgotPasswordResponse> {
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
