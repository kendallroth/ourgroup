import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

// Utilities
import { PASSWORD_REGEX } from "@common/utilities";

/** Forgot password request */
export class ForgotPasswordRequestDto {
  /** Account email to send password reset request to */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

/**
 * Forgot password reset step
 */
export class ForgotPasswordResetDto {
  /** Verification code */
  @IsString()
  @IsNotEmpty({ message: "Password reset code is required" })
  code!: string;

  /** New/updated password */
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: "Password is invalid",
  })
  password!: string;
}
