import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// Utilities
import { UsableTokenEntity } from "@common/entities";
import { Account } from "@modules/account/entities";
import { VerificationCode } from "../entities";

// Types
import { IVerificationCodeConfig, IVerificationCodeThrottle, VerificationCodeType } from "../types";
import { ThrottleError } from "@common/exceptions";

// Minimum seconds between regenerating verification codes
const MIN_VERIFICATION_CODE_REGEN_TIME = 1 * 60;

const emailCodeNanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCEDEFGHIJKLMNOPQRSTUVWZYZ0123456789", 32); // prettier-ignore
/** Verification code configs */
export const codeExpiryLength: Record<VerificationCodeType, IVerificationCodeConfig> = {
  account_verification: {
    expiry: 60 * 10, // 10 minutes
    generator: emailCodeNanoid,
  },
  password_reset: {
    expiry: 60 * 10, // 10 minutes
    generator: emailCodeNanoid,
  },
};

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepo: Repository<VerificationCode>,
  ) {}

  /**
   * Check whether a usable code has expired
   *
   * @param   code - Usable code
   * @returns Whether usable code has expired
   */
  checkIfExpired(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || (code.expiresAt && dayjs().isAfter(code.expiresAt));
  }

  /**
   * Check whether a usable code has been invalidated
   *
   * @param   code - Usable code
   * @returns Whether usable code has been invalidated
   */
  checkIfInvalidated(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || Boolean(code.invalidatedAt);
  }

  /**
   * Check whether a usable code has been used
   *
   * @param   code - Usable code
   * @returns Whether usable code has been used
   */
  checkIfUsed(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || Boolean(code.usedAt);
  }

  /**
   * Validate a usable code for several common use cases
   *
   * @param  code          - Usable code
   * @param  messagePrefix - Usable code failure message type
   * @throws Errors on verification failures (invalid, expired, invalidated, used)
   */
  checkUsableCode(code: UsableTokenEntity | null, messagePrefix: string): void {
    if (!code) {
      throw new BadRequestException(`${messagePrefix} not found`);
    } else if (this.checkIfUsed(code)) {
      throw new BadRequestException(`${messagePrefix} has already been used`);
    } else if (this.checkIfInvalidated(code)) {
      throw new BadRequestException(`${messagePrefix} has been invalidated`);
    } else if (this.checkIfExpired(code)) {
      throw new BadRequestException(`${messagePrefix} has already expired`);
    }
  }

  /**
   * Check whether enough time has elapsed since a previous verification code
   *   was generated to generate a new one.
   *
   * @param   code    - Verification code
   * @param   seconds - Minimum elapsed time
   * @returns Throttle information for code type
   */
  checkCodeThrottling(code: VerificationCode | null, seconds = 60): IVerificationCodeThrottle {
    if (!code) {
      return {
        delay: 0,
        valid: true,
      };
    }

    const interval = dayjs().diff(code.createdAt, "seconds");

    return {
      delay: Math.max(0, seconds - interval),
      valid: interval > seconds,
    };
  }

  /**
   * Check whether enough time has elapsed since a last verification code
   *   was generated to generate a new one.
   *
   * @param   account - Account to throttle
   * @param   type    - Verification code type
   * @param   seconds - Minimum elapsed time
   * @returns Throttle information for code type
   */
  async checkCodeThrottlingLast(
    account: Account,
    type: VerificationCodeType,
    seconds = 60,
  ): Promise<IVerificationCodeThrottle> {
    const lastCode = await this.getLastVerificationCode(account, type);

    return this.checkCodeThrottling(lastCode, seconds);
  }

  /**
   * Generate a verification code
   *
   * NOTE: By default will invalidate all previously unused/valid codes of this type for this account!
   *
   * @param   account            - Target account
   * @param   type               - Verification code type
   * @param   invalidatePrevious - Whether previous valid codes should be invalidated
   * @returns Generated verification code
   */
  async createVerificationCode(
    account: Account,
    type: VerificationCodeType,
    invalidatePrevious = true,
  ): Promise<VerificationCode> {
    const codeConfig = codeExpiryLength[type];

    const expiresAt = dayjs().add(codeConfig.expiry, "seconds");
    const code = codeConfig.generator();

    // Invalidate all previously unused/valid codes of this type for this account
    if (invalidatePrevious) {
      await this.verificationCodeRepo.update(
        {
          account,
          invalidatedAt: null,
          type,
          usedAt: null,
        },
        {
          invalidatedAt: new Date(),
        },
      );
    }

    // NOTE: Auto-generated code ID is used as the unique link between account and code,
    //         since the code itself may not be unique across the table (depending on size)!
    return this.verificationCodeRepo.save({
      account,
      code,
      expiresAt,
      invalidatedAt: null,
      type,
      usedAt: null,
    });
  }

  /**
   * Get last verification code entity for a account (used for preventing rapid regeneration)
   *
   * NOTE: Codes could be expired, invalidated, or already used (must be handled by developer)!
   *
   * @param   account - Target account
   * @param   type    - Code type
   * @returns Last verification code entity for account
   */
  async getLastVerificationCode(
    account: Account,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.verificationCodeRepo.findOne({
      order: { createdAt: "DESC" },
      relations: ["account"],
      where: { type, account },
    });

    return verificationCode ?? null;
  }

  /**
   * Get a verification code entity from a verification code
   *
   * NOTE: Codes could be expired, invalidated, or already used (must be handled by developer)!
   *
   * @param   code - Code string/value
   * @param   type - Code type
   * @returns Verification code entity
   */
  async getVerificationCode(
    code: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.verificationCodeRepo.findOne({
      order: { createdAt: "DESC" },
      relations: ["account"],
      where: { code, type },
    });

    return verificationCode ?? null;
  }

  /** Mark a verification code as used (performs no validation!) */
  async markUsed(code: VerificationCode): Promise<VerificationCode> {
    code.usedAt = new Date();
    return this.verificationCodeRepo.save(code);
  }

  /**
   * Generate a new verification code and invalidate a previous unused one (possibly expired)
   *
   * NOTE: Currently uncertain whether this is used anywhere?
   *
   * @param   code - Verification code
   * @param   type - Verification code type
   * @throws  Errors on verification failures (invalid, expired, invalidated, used)
   * @returns Regenerated verification code
   */
  async regenerateVerificationCode(
    code: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode> {
    const oldCode = await this.getVerificationCode(code, type);

    if (!oldCode) {
      throw new BadRequestException("Verification code not found");
    }
    // TODO: Determine how to handle a previously invalidated code...
    //         Resending invalidates previous codes, so likely not a big deal...
    /*if (this.checkIfInvalidated(oldCode)) {
      throw new BadRequestException("Verification code has been invalidated");
    }*/
    if (this.checkIfUsed(oldCode)) {
      throw new BadRequestException("Verification code already used");
    }

    // Prevent regenerating verification codes too quickly
    const codeThrottle = this.checkCodeThrottling(oldCode, MIN_VERIFICATION_CODE_REGEN_TIME);
    if (!codeThrottle.valid) {
      throw new ThrottleError("Wait between requesting codes", codeThrottle.delay);
    }

    // Invalidate the old verification code and generate a new one
    oldCode.invalidatedAt = new Date();
    await this.verificationCodeRepo.save(oldCode);

    return this.createVerificationCode(oldCode.account, type);
  }

  /**
   * Validate and use a verification code
   *
   * @param   code - Verification code
   * @param   type - Verification code type
   * @throws  Errors on verification failures (invalid, expired, invalidated, used)
   * @returns Verification code account
   */
  async useVerificationCode(code: string, type: VerificationCodeType): Promise<Account> {
    const verificationCode = await this.getVerificationCode(code, type);
    if (!verificationCode) {
      throw new BadRequestException("Verification code did not exist");
    }

    // Validate the provided code (not used, expired, or invalidated)
    // NOTE: Throws errors to control flow!
    this.checkUsableCode(verificationCode, "Verification code");

    await this.markUsed(verificationCode);

    return verificationCode.account;
  }
}
