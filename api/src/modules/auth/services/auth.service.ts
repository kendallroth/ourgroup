import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// Utilities
import { CodedError } from "@common/exceptions";
import { Account } from "@modules/account/entities";
import { AccountService } from "@modules/account/services";
import { jwtConfig as _jwtConfig } from "../config";
import { PasswordService } from "./password.service";
import { RefreshTokenService } from "./refresh-token.service";

// Types
import { IAuthenticationResponse, ChangePasswordDto, AuthLoginDto } from "../types";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(_jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof _jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    @Inject(forwardRef(() => RefreshTokenService))
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Change the authenticated account's password
   *
   * @param account                 - Authenticated account
   * @param credentials             - Account password credentials
   * @param credentials.newPassword - Account password credentials
   * @param credentials.oldPassword - Account password credentials
   */
  async changePassword(account: Account, credentials: ChangePasswordDto): Promise<void> {
    const { newPassword, oldPassword } = credentials;
    if (!newPassword) throw new BadRequestException("Password cannot be empty");

    const oldPasswordHash = await this.accountService.getPasswordHash(account);

    // Old password must match account's last passwod
    const oldPasswordMatches = await this.passwordService.verify(oldPassword, oldPasswordHash);
    if (!oldPasswordMatches) {
      throw new CodedError("CHANGE_PASSWORD__WRONG_PASSWORD", "Incorrect old password");
    }

    // Password cannot match account's last password
    const newPasswordMatchesOld = await this.passwordService.verify(newPassword, oldPasswordHash);
    if (newPasswordMatchesOld) {
      throw new CodedError(
        "CHANGE_PASSWORD__PASSWORD_MATCHES_OLD",
        "Password cannot match last password",
      );
    }

    await this.accountService.setPassword(account, newPassword);
  }

  /**
   * Generate a JWT auth token
   *
   * @param   account - Authorized account
   * @returns JWT auth token
   */
  generateAuthJwt(account: Account): string {
    return this.jwtService.sign({ email: account.email });
  }

  /**
   * Login authentication using JWT workflow
   *
   * @param   credentials - Account credentials
   * @returns Authentication JWT
   */
  public async login(credentials: AuthLoginDto): Promise<IAuthenticationResponse> {
    const { email, password } = credentials;

    // Invalid email should not inform account that there is no account with this email!
    const invalidCredentialsMessage = "Invalid authentication credentials";
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    const passwordHash = await this.accountService.getPasswordHash(account);
    const passwordMatches = await this.passwordService.verify(password, passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException(invalidCredentialsMessage);
    }

    // Track the last time a account signed in
    await this.accountService.logSignIn(account);

    return this.createAuthTokens(account);
  }

  /**
   * Set a account's password
   *
   * NOTE: Requires additional verification to make sure account can change password!
   * NOTE: Password cannot match account's last password (throws error)
   *
   * @param  account  - Account to change password for
   * @param  password - New account password
   * @throws Password cannot match account's last password
   */
  async setPassword(account: Account, password: string): Promise<void> {
    if (!password) throw new BadRequestException("Password cannot be empty");

    // Password cannot match account's last password
    const oldPasswordHash = await this.accountService.getPasswordHash(account);
    const matchesOldPassword = await this.passwordService.verify(password, oldPasswordHash);
    if (matchesOldPassword) {
      throw new CodedError(
        "CHANGE_PASSWORD__PASSWORD_MATCHES_OLD",
        "Password cannot match last password",
      );
    }

    await this.accountService.setPassword(account, password);
  }

  /**
   * Create JWT tokens for an authenticated account
   *
   * @param   account - Authenticated account
   * @returns JWT tokens
   */
  public async createAuthTokens(account: Account): Promise<IAuthenticationResponse> {
    const { jwtExpirySeconds } = this.jwtConfig;

    const token = this.generateAuthJwt(account);
    // Refresh token is hashed before storage, but plaintext refresh token must be sent to account!
    const refreshToken = await this.refreshTokenService.generateRefreshToken(account);

    return {
      expiresIn: jwtExpirySeconds,
      refreshToken,
      token,
      accountId: account.accountId,
    };
  }
}
