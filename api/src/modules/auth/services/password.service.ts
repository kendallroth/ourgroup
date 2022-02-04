import crypto from "crypto";
import { Inject, Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { ConfigType } from "@nestjs/config";

// Utilities
import { passwordConfig as _passwordConfig } from "../config";

/**
 * Secure text hashing and comparison
 *
 * NOTE: This is not necessarily only used for passwords! Current uses
 *         include passwords and refresh tokens.
 */
@Injectable()
export class PasswordService {
  constructor(
    @Inject(_passwordConfig.KEY)
    private readonly passwordConfig: ConfigType<typeof _passwordConfig>,
  ) {}

  /**
   * Generate a random salt string
   *
   * @returns Random salt string
   */
  private getRandomSalt(): string {
    const { hashSaltSize } = this.passwordConfig;

    return nanoid(hashSaltSize);
  }

  /**
   * Extract the salt from a hashed string
   *
   * @param   hash - Hashed string
   * @returns Extracted hash salt
   */
  private getSaltFromHash(hash: string): string {
    const { hashSaltSize } = this.passwordConfig;

    return hash.slice(0, hashSaltSize);
  }

  /**
   * Hash a plaintext string (optional salt)
   *
   * @param   plainText - Plain text string
   * @param   salt      - Hashing salt (optional)
   * @returns Hashed string
   */
  public async hash(plainText: string, salt?: string): Promise<string> {
    const hashSalt = salt ?? this.getRandomSalt();

    return new Promise((resolve, reject) => {
      const { hashDigest, hashKeyLength, hashRounds } = this.passwordConfig;

      crypto.pbkdf2(plainText, hashSalt, hashRounds, hashKeyLength, hashDigest, (error, hashed) => {
        if (error) return reject(error);

        resolve(hashSalt + hashed.toString("base64"));
      });
    });
  }

  /**
   * Verify a plaintext string against a hash
   *
   * @param   plainText    - Plaintext string
   * @param   originalHash - Hashed string
   * @returns Whether plaintext string matches hash
   */
  public async verify(plainText: string, originalHash: string): Promise<boolean> {
    const salt = this.getSaltFromHash(originalHash);
    const hash = await this.hash(plainText, salt);
    return hash === originalHash;
  }
}
