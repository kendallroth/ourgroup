import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

// Utilities
import { PASSWORD_REGEX } from "@common/utilities";

/** Authentication login request */
export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

/** Change authenticated account password */
export class ChangePasswordDto {
  // NOTE: Current password only needs to match DB password (in case not valid with regex...)

  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, {
    message: "Password is invalid",
  })
  newPassword!: string;
}

/** Use a refresh token to generate a new auth token */
export class RefreshTokenDto {
  /** Account ID for refresh token */
  @IsNotEmpty()
  @IsString({ message: "Account ID is required" })
  accountId!: string;

  /** Refresh token from previous authentication workflow */
  @IsNotEmpty()
  @IsString({ message: "Refresh token is required" })
  refreshToken!: string;
}

/** Revoke a refresh token */
export class RefreshTokenRevokeDto extends RefreshTokenDto {}
