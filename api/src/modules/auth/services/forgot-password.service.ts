import { forwardRef, Inject, Injectable } from "@nestjs/common";

// Utilities
import { AccountService } from "@modules/account/services";
import { AuthService } from "./auth.service";
import { codeExpiryLength, TokenService } from "./token.service";

// Types
import {
  VerificationCodeType,
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  IForgotPasswordResponse,
} from "../types";
import { ThrottleError } from "@common/exceptions";

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  /**
   * Request a password reset
   *
   * @param   credentials - Account credentials (email)
   * @returns Password reset information
   */
  public async forgotPasswordRequest(
    credentials: ForgotPasswordRequestDto,
  ): Promise<IForgotPasswordResponse> {
    const { email } = credentials;

    const verificationType = VerificationCodeType.PASSWORD_RESET;
    const codeExpiry = codeExpiryLength[verificationType].expiry;

    // Invalid email should not inform account that there is no account with this email,
    //   which means "faking" a password reset (but no code is ever generated/sent).
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      return {
        expiry: codeExpiry,
      };
    }

    // TODO: Check if there are existing password reset codes (disable) and prevent resending too quickly.
    //         This should maybe be done in a separate "resend" workflow and utilize the "regenerateVerificationCode" function.
    const codeThrottle = await this.tokenService.checkCodeThrottling(
      account,
      VerificationCodeType.PASSWORD_RESET,
    );
    if (!codeThrottle.valid) {
      throw new ThrottleError("Wait before requesting again", codeThrottle.delay); // prettier-ignore
    }

    // Create password reset verification code and send to email
    const verificationCode = await this.tokenService.createVerificationCode(
      account,
      verificationType,
    );

    // TODO: Send emails with SendGrid
    console.log(`[PasswordReset]: Use '${verificationCode.code}' to reset password`); // prettier-ignore

    return {
      expiry: codeExpiry,
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

    // TODO: Must check password validity BEFORE marking verification code as used!

    // Validate and use a verification code (throws errors if invalid)
    const account = await this.tokenService.useVerificationCode(
      code,
      VerificationCodeType.PASSWORD_RESET,
    );

    // NOTE: Throws error if account attempts to change password to last password!
    await this.authService.setPassword(account, password);
  }
}
