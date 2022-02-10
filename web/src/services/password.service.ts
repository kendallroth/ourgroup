// Utilities
import ApiService from "./api.service";

// Types
import { IEmailResendResponse } from "@typings/auth.types";
import { IChangePasswordDto, IForgotPasswordResetDto } from "@typings/password.types";

class PasswordService {
  /** Change current account password */
  async changePassword(payload: IChangePasswordDto) {
    const response = await ApiService.api.patch("/auth/password/change", payload);

    return response.data;
  }

  /** Request a password reset */
  async forgotPasswordRequest(email: string): Promise<IEmailResendResponse> {
    const response = await ApiService.api.post("/auth/password/forget", {
      email,
    });

    return response.data;
  }

  /** Reset password after initiating password reset workflow */
  async forgotPasswordReset(payload: IForgotPasswordResetDto): Promise<void> {
    const response = await ApiService.api.post("/auth/password/reset", payload);

    return response.data;
  }
}

const singleton = new PasswordService();
export default singleton;
