<template>
  <auth-layout title="Account Verification">
    <div v-if="!loading" class="verification-prompt">
      <template v-if="activationError">
        <v-alert border="left" type="error">
          {{ activationError }}
        </v-alert>
        <span class="mt-4">
          This email code is invalid, and you will need to request another email to activate your
          account.
        </span>
        <v-btn
          :disabled="resendDisabled || true"
          class="mt-6"
          color="primary"
          replace
          size="large"
          to="/verify/resend"
        >
          Resend Verification
        </v-btn>
      </template>
      <template v-else>
        <v-alert border="left" type="success">Your account has been verified!</v-alert>
        <v-btn class="mt-6" color="primary" size="large" @click="onContinue">Continue</v-btn>
      </template>
    </div>
    <div v-else class="verification-prompt__loading">
      <v-progress-circular color="primary" indeterminate size="80" />
    </div>
  </auth-layout>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

// Components
import AuthLayout from "./components/AuthLayout.vue";

// Utilities
import { useAccountVerifyResend, useErrors } from "@composables";
import { AccountService } from "@services";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "AuthVerify",
  components: {
    AuthLayout,
  },
  setup() {
    const activationError = ref<string | null>(null);
    const loading = ref(false);

    const accountStore = useAccountStore();
    const { resendVerification, resendDisabled } = useAccountVerifyResend();
    const { getError } = useErrors();
    const route = useRoute();

    /** Link to coninue after verifying account */
    const continueLink = computed(() => (accountStore.authenticated ? "/" : "/login"));

    onBeforeMount(() => {
      checkVerificationCode();
    });

    /** Check verification code (URL) */
    const checkVerificationCode = async () => {
      const { code } = route.params;
      loading.value = true;

      try {
        await AccountService.verifyAccount(code as string);
        accountStore.updateAccount({ verifiedAt: dayjs().toISOString() });
      } catch (e: any) {
        loading.value = false;
        activationError.value = getError(e, "Could not verify account");
        // TODO: Display error snackbar
        return;
      }

      loading.value = false;
      // TODO: Display success snackbar
    };

    /** Proceed to app after verifying account */
    const onContinue = () => {
      window.location.replace(continueLink.value);
    };

    /** Resend verification code */
    const onResendVerification = async () => {
      try {
        await resendVerification();
      } catch {
        // TODO: Display error snackbar
      }
    };

    return {
      activationError,
      loading,
      resendDisabled,
      onContinue,
      onResendVerification,
    };
  },
});
</script>

<style lang="scss" scoped>
.verification-prompt {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  align-self: center;
}

.verification-prompt__loading {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}
</style>
