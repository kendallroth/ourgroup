import crypto from "crypto";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// Utilities
import { Account } from "@modules/account/entities";
import { jwtConfig as _jwtConfig } from "../config";
import { RefreshToken } from "../entities";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

// Types
import { IAuthenticationResponse, RefreshTokenDto, RefreshTokenRevokeDto } from "../types";

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(_jwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof _jwtConfig>,
    private readonly tokenService: TokenService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  /**
   * Generate a refresh token for a account
   *
   * NOTE: Refresh tokens are hashed before storage (using account ID as salt)
   *
   * @param   account - Authenticated account
   * @returns Generated plaintext refresh token
   */
  async generateRefreshToken(account: Account): Promise<string> {
    const { refreshTokenExpirySeconds, refreshTokenLength } = this.jwtConfig;

    const refreshTokenPlain = nanoid(refreshTokenLength);

    // NOTE: Refresh tokens SHOULD NOT be hashed with bcrypt, as hashed tokens cannot be easily
    //         retrieved from the database, which requires a comparison loop through bcrypt comparison.
    //         This is insanely slow (entire purpose of bcrypt algorithm) and must be avoided!
    const refreshTokenHashed = await this.hashRefreshToken(refreshTokenPlain, account.id);

    await this.refreshTokenRepo.save({
      expiresAt: dayjs().add(refreshTokenExpirySeconds, "seconds").toDate(),
      token: refreshTokenHashed,
      account,
    });

    // NOTE: Unhashed refresh token must be returned to account (not encrypted version)!
    return refreshTokenPlain;
  }

  /**
   * Find an account refresh token
   *
   * @param token - Refresh token (plain text)
   */
  private async getRefreshToken(token: RefreshTokenDto): Promise<RefreshToken | null> {
    const { accountId, refreshToken: refreshTokenString } = token;

    // Refresh tokens are lightly hashed upon storage (account ID as salt) to reduce security risk.
    //   Account ID is included in hash as a way to generate identical hash for comparison purposes.
    const hashedToken = await this.hashRefreshToken(refreshTokenString, accountId);

    const refreshToken = await this.refreshTokenRepo.findOne({
      relations: ["account"],
      where: {
        accountId,
        token: hashedToken,
      },
    });

    return refreshToken ?? null;
  }

  /**
   * Lightly hash a refresh token (using account ID as "reproducible" salt)
   *
   * NOTE: This does not entirely mitigate security risks, but is better than storing plaintext!
   *         Avoid using bcrypt as it is extremely slow for comparisons!
   *
   * @param   refreshToken - Raw refresh token
   * @param   accountId    - Account ID (used as salt)
   * @returns Hashed refresh token
   */
  async hashRefreshToken(refreshToken: string, accountId: string): Promise<string> {
    // NOTE: The only thing this does is make the refresh token salt less obvious,
    //         it does not add any actual measure of security!
    const accountIdSalt = accountId.replace(/-/g, "").split("").reverse().join("");

    return new Promise((resolve, reject) => {
      const { refreshTokenLength: length, refreshTokenRounds: rounds } = this.jwtConfig;

      crypto.pbkdf2(refreshToken, accountIdSalt, rounds, length, "sha512", (error, hashed) => {
        if (error) return reject(error);

        resolve(hashed.toString("base64"));
      });
    });
  }

  /**
   * Get a new auth token from a refresh token
   *
   * @param payload - Refresh token/account
   */
  async refreshAuthToken(payload: RefreshTokenDto): Promise<IAuthenticationResponse> {
    const refreshToken = await this.getRefreshToken(payload);
    if (!refreshToken) {
      throw new BadRequestException("Invalid refresh token");
    }

    // Validate the provided refresh token (not used, expired, or invalidated)
    // NOTE: Throws errors to control flow!
    this.tokenService.checkUsableCode(refreshToken, "Refresh token");

    // Mark the old refresh token as used
    refreshToken.usedAt = new Date();
    await this.refreshTokenRepo.save(refreshToken);

    return this.authService.createAuthTokens(refreshToken.account);
  }

  /**
   * Ensure a refresh token is revoked
   *
   * Can be used during logout to ensure refresh token cannot be used again!
   *
   * @param payload - Refresh token/account
   */
  async revokeRefreshToken(payload: RefreshTokenRevokeDto): Promise<void> {
    const refreshToken = await this.getRefreshToken(payload);
    // Not finding a refresh token when revoking should silently end (not a failure)
    if (!refreshToken) return;

    refreshToken.invalidatedAt = new Date();
    await this.refreshTokenRepo.save(refreshToken);
  }
}
