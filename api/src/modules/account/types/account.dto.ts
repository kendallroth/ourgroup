import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

// Utilities
import { PASSWORD_REGEX } from "@common/utilities";

export class AccountCreateDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: "Password is invalid",
  })
  password!: string;
}

export class AccountVerifyDto {
  /** Account verification code */
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export class AccountVerifyResendDto {
  /** Unverified account email */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
