import dayjs from "dayjs";
import { ComputedRef } from "vue";

// Utilities
import { AccountService } from "@services";
import { useAccountStore } from "@store";
import { useCountdown } from "./countdown";
import { useErrors } from "./errors";
import { useSnackbar } from "./snackbar";

interface IUseAccountVerifyResend {
  /** Whether verification resend is temporarily disabled */
  resendDisabled: ComputedRef<boolean>;
  /** Start verification resend countdown (disables temporarily) */
  resendVerification: () => Promise<void>;
}

const useAccountVerifyResend = (): IUseAccountVerifyResend => {
  const accountStore = useAccountStore();
  const { countdownActive, startCountdown } = useCountdown();
  const { hasError } = useErrors();
  const { notify } = useSnackbar();

  /** Resend account verification email */
  const resendVerification = async () => {
    const email = accountStore.$state.account?.email;
    if (!email) return;

    try {
      const meta = await AccountService.verifyAccountResend(email);
      startCountdown(meta.wait);
    } catch (e: any) {
      if (hasError(e, "ACCOUNT_VERIFY_RESEND__ALREADY_VERIFIED")) {
        notify("Account was already verified");
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
