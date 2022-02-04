import dayjs from "dayjs";
import { customAlphabet } from "nanoid";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// Utilities
import { Account } from "@modules/account/entities";
import { VerificationCode } from "../entities";

// Types
import { IVerificationCodeConfig, IVerificationCodeThrottle, VerificationCodeType } from "../types";
import { UsableTokenEntity } from "@common/entities";

// Minimum minutes between regenerating verification codes
const MIN_VERIFICATION_CODE_REGEN_TIME = 1;

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
  public constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepo: Repository<VerificationCode>,
  ) {}

  /**
   * Check whether a usable code has expired
   *
   * @param   code - Usable code
   * @returns Whether usable code has expired
   */
  public checkIfExpired(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || (code.expiresAt && dayjs().isAfter(code.expiresAt));
  }

  /**
   * Check whether a usable code has been invalidated
   *
   * @param   code - Usable code
   * @returns Whether usable code has been invalidated
   */
  public checkIfInvalidated(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || Boolean(code.invalidatedAt);
  }

  /**
   * Check whether a usable code has been used
   *
   * @param   code - Usable code
   * @returns Whether usable code has been used
   */
  public checkIfUsed(code: UsableTokenEntity): boolean {
    // NOTE: Missing codes should never be considered valid!
    return !code || Boolean(code.usedAt);
  }

  /**
   * Validate a usable code for several common use cases
   *
   * @param  code    - Usable code
   * @param  message - Usable code failure message type
   * @throws Errors on verification failures (invalid, expired, invalidated, used)
   */
  public checkUsableCode(code: UsableTokenEntity | null, message: string): void {
    if (!code) {
      throw new BadRequestException(`${message} not found`);
    } else if (this.checkIfUsed(code)) {
      throw new BadRequestException(`${message} has already been used`);
    } else if (this.checkIfInvalidated(code)) {
      throw new BadRequestException(`${message} has been invalidated`);
    } else if (this.checkIfExpired(code)) {
      throw new BadRequestException(`${message} has already expired`);
    }
  }

  /**
   * Check whether enough time has elapsed since last code was generated for a account
   *
   * @param   account - Target account
   * @param   type    - Verification code type
   * @param   seconds - Minimum elapsed time
   * @returns Throttle information for code type
   */
  public async checkCodeThrottling(
    account: Account,
    type: VerificationCodeType,
    seconds = 60,
  ): Promise<IVerificationCodeThrottle> {
    const lastCode = await this.getLastVerificationCode(account, type);

    // Prevent sending verification codes too rapidly
    if (!lastCode) {
      return {
        delay: 0,
        valid: true,
      };
    }

    const interval = dayjs().diff(lastCode.createdAt, "seconds");

    return {
      delay: Math.max(0, seconds - interval),
      valid: interval > seconds,
    };
  }

  /**
   * Generate a verification code
   *
   * @param   account - Target account
   * @param   type    - Verification code type
   * @returns Generated verification code
   */
  async createVerificationCode(
    account: Account,
    type: VerificationCodeType,
  ): Promise<VerificationCode> {
    const codeConfig = codeExpiryLength[type];

    const expiresAt = dayjs().add(codeConfig.expiry, "seconds");
    const code = codeConfig.generator();

    // Invalidate all previously unused/valid codes of this type for this account
    await this.verificationCodeRepo.update(
      {
        invalidatedAt: null,
        type,
        usedAt: null,
        account,
      },
      {
        invalidatedAt: new Date(),
      },
    );

    // NOTE: Auto-generated code ID is used as the unique link between account and code,
    //         since the code itself may not be unique across the table (depending on size)!
    return this.verificationCodeRepo.save({
      expiresAt,
      invalidatedAt: null,
      code,
      type,
      usedAt: null,
      account,
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
  public async getLastVerificationCode(
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
  public async getVerificationCode(
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

  /**
   * Generate a new verification code and invalidate a previous unused one (possibly expired)
   *
   * @param   code - Verification code
   * @param   type - Verification code type
   * @throws  Errors on verification failures (invalid, expired, invalidated, used)
   * @returns Regenerated verification code
   */
  public async regenerateVerificationCode(
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

    // Prevent regenerating verification codes too quickly (1 min)
    const now = dayjs();
    const interval = dayjs(now).diff(oldCode.createdAt, "minutes");
    if (interval < MIN_VERIFICATION_CODE_REGEN_TIME) {
      throw new BadRequestException("Wait between requesting codes");
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
  public async useVerificationCode(code: string, type: VerificationCodeType): Promise<Account> {
    const verificationCode = await this.getVerificationCode(code, type);
    if (!verificationCode) {
      throw new BadRequestException("Verification code did not exist");
    }

    // Validate the provided code (not used, expired, or invalidated)
    // NOTE: Throws errors to control flow!
    this.checkUsableCode(verificationCode, "Verification code");

    verificationCode.usedAt = new Date();
    await this.verificationCodeRepo.save(verificationCode);

    return verificationCode.account;
  }
}
