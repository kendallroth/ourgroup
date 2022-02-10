export interface IChangePasswordDto {
  /** Changed/new password */
  newPassword: string;
  /** Current/old password */
  oldPassword: string;
}

export interface IForgotPasswordResetDto {
  /** Forgot password verification code */
  code: string;
  /** New password */
  password: string;
}
