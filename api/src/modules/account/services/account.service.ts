import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

// Utilities
import { CodedError, ThrottleError } from "@common/exceptions";
import {
  AuthService,
  codeExpiryLength,
  PasswordService,
  TokenService,
} from "@modules/auth/services";
import { Account } from "../entities";

// Types
import { IAuthenticationResponse, VerificationCodeType } from "@modules/auth/types";
import {
  AccountCreateDto,
  AccountVerifyDto,
  AccountVerifyResendDto,
  IAccountPrivateInfo,
  IAccountVerifyResendResponse,
} from "../types";

// Minimum minutes between regenerating verification codes
const MIN_VERIFICATION_CODE_REGEN_TIME = 1 * 60;

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PasswordService))
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Create a new account
   *
   * @param   payload - New account credentials
   * @returns Authentication tokens
   */
  async createAccount(payload: AccountCreateDto): Promise<IAuthenticationResponse> {
    const { email: _email, name: _name, password } = payload;

    const email = _email.trim().toLowerCase();
    const name = _name.trim();

    const emailAccount = await this.findByEmail(email);
    if (emailAccount) {
      throw new CodedError(
        "REGISTER__EMAIL_ALREADY_USED",
        "Email is already registered",
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await this.passwordService.hash(password);

    const account = await this.accountRepo.save({
      email,
      name,
      password: passwordHash,
      verifiedAt: null,
    });

    // Create verification code and send to email
    const verificationType = VerificationCodeType.ACCOUNT_VERIFICATION;
    const verificationCode = await this.tokenService.createVerificationCode(
      account,
      verificationType,
    );

    // TODO: Send emails with SendGrid
    const appUrl = this.configService.get<string>("app.webAppUrl");
    const verificationUrl = `${appUrl}/verify/${verificationCode.code}`;
    console.log(`[AccountCreate]: Use '${verificationCode.code}' to verify account (${verificationUrl})`); // prettier-ignore

    return this.authService.createAuthTokens(account);
  }

  /**
   * Find an account by email
   *
   * @param   email - Account email
   * @returns Account with email address
   */
  async findByEmail(email: string): Promise<Account | undefined> {
    return this.accountRepo.findOne({ where: { email: ILike(email) } });
  }

  /**
   * Get a password hash (for login verification)
   *
   * @param   account - Account email
   * @returns Account password hash
   */
  async getPasswordHash(account: Account): Promise<string> {
    // Password hash is excluded from TypeORM query results (requires raw query)
    // NOTE: We know the account exists because a account entity was provided
    const hashResult = await this.accountRepo.query(
      `SELECT password FROM "account" WHERE id = $1;`,
      [account.id],
    );
    if (!hashResult || !hashResult.length) return "";

    return hashResult[0].password || "";
  }

  /**
   * Get account's private profile information
   *
   * @param   account - Authenticated account
   * @returns Account's private profile
   */
  async getPrivateProfile(account: Account): Promise<IAccountPrivateInfo> {
    return {
      id: account.id,
      createdAt: account.createdAt,
      email: account.email,
      name: account.name,
      verifiedAt: account.verifiedAt,
    };
  }

  /**
   * Log the last time a account signed in (helpful for support)
   *
   * @param   account - Authenticated account
   * @returns Authenticated account
   */
  async logSignIn(account: Account): Promise<Account> {
    account.lastLoginAt = new Date();

    return this.accountRepo.save(account);
  }

  /**
   * Mark a account as verified
   *
   * @param   account - Unverified account
   * @returns Verified account
   */
  async markVerified(account: Account): Promise<Account> {
    // Avoid marking account as verified twice!
    if (account.verifiedAt) return account;

    account.verifiedAt = new Date();

    return this.accountRepo.save(account);
  }

  /**
   * Hash and set a account's password (no verification!)
   *
   * NOTE: Any verification must happen before setting password!
   *
   * @param  account  - Account to change password for
   * @param  password - New account password (plaintext)
   */
  async setPassword(account: Account, password: string): Promise<void> {
    if (!password) throw new BadRequestException("Password cannot be empty");

    const passwordHash = await this.passwordService.hash(password);
    account.password = passwordHash;

    await this.accountRepo.save(account);
  }

  /**
   * Verify a newly created account
   *
   * @param   payload - Account verification code
   * @returns Authentication tokens
   */
  async verifyAccount(payload: AccountVerifyDto): Promise<IAuthenticationResponse> {
    const { code } = payload;

    const verificationCode = await this.tokenService.getVerificationCode(
      code,
      VerificationCodeType.ACCOUNT_VERIFICATION,
    );
    if (!verificationCode) {
      throw new BadRequestException("Verification code not found");
    }

    // Accounts can only be verified once!
    if (verificationCode.account.verifiedAt) {
      throw new CodedError("ACCOUNT_VERIFY__ALREADY_VERIFIED", "Account is already verified");
    }

    // Validate and use a verification code (throws errors if invalid/missing)
    const account = await this.tokenService.useVerificationCode(
      code,
      VerificationCodeType.ACCOUNT_VERIFICATION,
    );

    await this.markVerified(account);

    // Account may or may not already be signed in (should be able to replicate authentication if not)
    return this.authService.createAuthTokens(account);
  }

  /**
   * Resend a account verification email
   *
   * @param   payload - Unverified account email
   * @returns Email verification information
   */
  async verifyAccountResend(
    payload: AccountVerifyResendDto,
  ): Promise<IAccountVerifyResendResponse> {
    const { email } = payload;

    const account = await this.findByEmail(email);
    if (!account) {
      throw new NotFoundException("Account not found");
    }

    if (account.verifiedAt) {
      throw new CodedError(
        "ACCOUNT_VERIFY_RESEND__ALREADY_VERIFIED",
        "Account already verified",
        HttpStatus.CONFLICT,
      );
    }

    const verificationType = VerificationCodeType.ACCOUNT_VERIFICATION;
    const codeExpiry = codeExpiryLength[verificationType].expiry;

    // Prevent resending email verification codes too rapidly
    const codeThrottle = await this.tokenService.checkCodeThrottling(
      account,
      verificationType,
      MIN_VERIFICATION_CODE_REGEN_TIME,
    );
    if (!codeThrottle.valid) {
      throw new ThrottleError("Wait before requesting again", codeThrottle.delay); // prettier-ignore
    }

    // Create email verification code and send to email
    const verificationCode = await this.tokenService.createVerificationCode(
      account,
      verificationType,
    );

    // TODO: Send emails with SendGrid
    const appUrl = this.configService.get<string>("app.webAppUrl");
    const verificationUrl = `${appUrl}/verify/${verificationCode.code}`;
    console.log(`[AccountVerification]: Use '${verificationCode.code}' to verify account (${verificationUrl})`); // prettier-ignore

    return {
      expiry: codeExpiry,
      wait: MIN_VERIFICATION_CODE_REGEN_TIME,
    };
  }
}
