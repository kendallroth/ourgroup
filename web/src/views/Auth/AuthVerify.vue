<template>
  <auth-title title="Account Verification" />
  <div v-if="!loading" class="verification-prompt">
    <template v-if="activationError">
      <v-alert border="left" type="error">
        {{ activationError }}
      </v-alert>
      <span class="mt-4">
        This email code is invalid, and you will need to request another email to activate your
        account.
      </span>
      <v-btn disabled class="mt-6" color="primary" replace size="large" to="/verify/resend">
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
</template>

<script lang="ts">
import dayjs from "dayjs";
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { useErrors, useSnackbar } from "@composables";
import { AccountService } from "@services";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "AuthVerify",
  components: {
    AuthTitle,
  },
  setup() {
    const activationError = ref<string | null>(null);
    const loading = ref(false);

    const accountStore = useAccountStore();
    const { getError } = useErrors();
    const { notifyError } = useSnackbar();
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
        const errorMessage = getError(e, "Could not verify account");
        activationError.value = errorMessage;
        notifyError(errorMessage);
        return;
      }

      loading.value = false;
    };

    /** Proceed to app after verifying account */
    const onContinue = () => {
      window.location.replace(continueLink.value);
    };

    return {
      activationError,
      loading,
      onContinue,
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
