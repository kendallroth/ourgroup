<template>
  <app-page size="small">
    <v-card class="profile-card">
      <h2>Profile</h2>
      <template v-if="account">
        <div class="profile__label">Name</div>
        <div class="profile__value">{{ account.name ?? "N/A" }}</div>
        <div class="profile__label">Email</div>
        <div class="profile__value">{{ account.email }}</div>
        <div class="profile__label">Verified At</div>
        <div class="profile__value">
          {{
            account.verifiedAt ? $filters.formatDate(account.verifiedAt, "MMMM DD, YYYY") : "N/A"
          }}
        </div>
        <v-alert
          v-if="!accountStore.verified"
          border="start"
          class="profile-card__unverified-alert"
          type="error"
        >
          Your account has not been verified!
          <v-btn
            :disabled="resendDisabled"
            size="small"
            variant="outlined"
            @click="onResendVerification"
          >
            Resend
          </v-btn>
        </v-alert>
      </template>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

// Utilities
import { useAccountVerifyResend, useErrors, useSnackbar } from "@composables";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "AccountProfile",
  setup() {
    const accountStore = useAccountStore();
    const { resendVerification, resendDisabled } = useAccountVerifyResend();
    const { getError } = useErrors();
    const { notifyError } = useSnackbar();

    const onResendVerification = async () => {
      try {
        await resendVerification();
      } catch (e: any) {
        notifyError(getError(e, "Failed to resend verification"));
      }
    };

    return {
      accountStore,
      account: computed(() => accountStore.account),
      resendDisabled,
      onResendVerification,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-card {
  padding: 24px;
  margin: 32px 0;
}

.profile__unverified-prompt {
  margin-top: 24px;
}

// TODO: Remove temporary classes
.profile__label {
  margin-top: 8px;
  font-weight: 600;
}

.profile-card__unverified-alert {
  margin-top: 16px;

  :deep(.v-alert__avatar) {
    align-self: center;
  }

  :deep(.v-alert__text) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
  }
}
</style>
