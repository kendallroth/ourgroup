import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

// Utilities
import _appConfig from "@app/app.config";
import { ThrottleError } from "@common/exceptions";
import { AccountService } from "@modules/account/services";
import { AuthService } from "./auth.service";
import { codeExpiryLength, TokenService } from "./token.service";

// Types
import {
  IEmailResendResponse,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  VerificationCodeType,
} from "../types";

// Minimum seconds between resending forgot password email
const MIN_RESEND_REGEN_TIME = 1 * 60;

@Injectable()
export class ForgotPasswordService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    @Inject(_appConfig.KEY)
    private readonly appConfig: ConfigType<typeof _appConfig>,
  ) {}

  /**
   * Request a password reset
   *
   * @param   credentials - Account credentials (email)
   * @returns Password reset information
   */
  public async forgotPasswordRequest(
    credentials: ForgotPasswordRequestDto,
  ): Promise<IEmailResendResponse> {
    const { email } = credentials;

    const verificationType = VerificationCodeType.PASSWORD_RESET;
    const codeExpiry = codeExpiryLength[verificationType].expiry;

    // Invalid email should not inform account that there is no account with this email,
    //   which means "faking" a password reset (but no code is ever generated/sent).
    // NOTE: Since no email is sent or verification code generated, the "wait" functionality
    //         cannot be enforced (except UI). This means attackers could determine whether
    //         an email address is valid by whether the timeout is enforced...
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      return {
        expiry: codeExpiry,
        wait: MIN_RESEND_REGEN_TIME,
      };
    }

    // Prevent requesting password resets too rapidly
    const codeThrottle = await this.tokenService.checkCodeThrottlingLast(
      account,
      VerificationCodeType.PASSWORD_RESET,
      MIN_RESEND_REGEN_TIME,
    );
    if (!codeThrottle.valid) {
      throw new ThrottleError("Wait between requesting password reset", codeThrottle.delay);
    }

    // Create password reset verification code and send to email
    const verificationCode = await this.tokenService.createVerificationCode(
      account,
      verificationType,
    );

    // TODO: Send emails with SendGrid
    const verificationUrl = `${this.appConfig.webAppUrl}/auth/password/reset/${verificationCode.code}`;
    console.log(`[PasswordReset]: Use '${verificationCode.code}' to reset password (${verificationUrl})`); // prettier-ignore

    return {
      expiry: codeExpiry,
      wait: MIN_RESEND_REGEN_TIME,
    };
  }

  /**
   * Reset a account's password with emailed code
   *
   * @param  credentials - Password reset credentials
   * @throws Error if account attempts to set password to last password
   */
  public async forgotPasswordReset(credentials: ForgotPasswordResetDto): Promise<void> {
    const { code, password } = credentials;

    const verificationCode = await this.tokenService.getVerificationCode(
      code,
      VerificationCodeType.PASSWORD_RESET,
    );

    // Ensure password reset token is valid before attempting password reset,
    //   as user may try invalid password (should not invalidate token)!
    this.tokenService.checkUsableCode(verificationCode, "Forgot password code");

    // NOTE: Throws error if account attempts to change password to last password!
    await this.authService.setPassword(verificationCode!.account, password);

    // Validate and use a verification code (throws errors if invalid)
    await this.tokenService.markUsed(verificationCode!);
  }
}
