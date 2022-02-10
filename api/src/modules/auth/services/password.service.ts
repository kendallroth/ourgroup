import bcrypt from "bcrypt";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";

// Utilities
import { passwordConfig as _passwordConfig } from "../config";

/**
 * Secure text hashing and comparison (using bcrypt)
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
   * Hash a plaintext string (using bcrypt)
   *
   * @param   plainText - Plain text string
   * @returns Hashed string
   */
  async hash(plainText: string): Promise<string> {
    const { hashSaltRounds } = this.passwordConfig;
    return bcrypt.hash(plainText, hashSaltRounds);
  }

  /**
   * Verify a plaintext string against a hash
   *
   * @param   plainText    - Plaintext string
   * @param   originalHash - Hashed string
   * @returns Whether plaintext string matches hash
   */
  async verify(plainText: string, originalHash: string): Promise<boolean> {
    return bcrypt.compare(plainText, originalHash);
  }
}
