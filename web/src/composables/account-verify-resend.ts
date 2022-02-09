import dayjs from "dayjs";
import { ComputedRef } from "vue";

// Utilities
import { AccountService } from "@services";
import { useAccountStore } from "@store";
import { useCountdown } from "./countdown";
import { useErrors } from "./errors";

interface IUseAccountVerifyResend {
  /** Whether verification resend is temporarily disabled */
  resendDisabled: ComputedRef<boolean>;
  /** Start verification resend countdown (disables temporarily) */
  resendVerification: () => Promise<void>;
}

const useAccountVerifyResend = (): IUseAccountVerifyResend => {
  const accountStore = useAccountStore();
  const { countdownActive, startCountdown } = useCountdown();
  const { getErrorCode } = useErrors();

  /** Resend account verification email */
  const resendVerification = async () => {
    const email = accountStore.$state.account?.email;
    if (!email) return;

    try {
      const meta = await AccountService.verifyAccountResend(email);
      startCountdown(meta.wait);
    } catch (e: any) {
      const errorCode = getErrorCode(e);
      if (errorCode === "ACCOUNT_VERIFY_RESEND__ALREADY_VERIFIED") {
        // TODO: Display snackbar
        accountStore.updateAccount({ verifiedAt: dayjs().toISOString() });
      } else {
        throw e;
      }
    }
  };

  return {
    resendDisabled: countdownActive,
    resendVerification,
  };
};

export { useAccountVerifyResend };
