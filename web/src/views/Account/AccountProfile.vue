<template>
  <app-page size="small">
    <title-bar class="my-4" title="Profile" type="h1" />
    <v-card class="profile-card">
      <template v-if="account">
        <form class="profile__form">
          <div class="profile__label">Name</div>
          <text-field
            density="comfortable"
            :disabled="submitting"
            :placeholder="!account.name ? 'N/A' : ''"
            name="name"
            persistent-placeholder
            single-line
          />
          <div class="profile__label">Email</div>
          <v-text-field :model-value="account.email" density="comfortable" disabled single-line />
          <v-alert
            v-if="!account.verifiedAt"
            border="start"
            class="profile-card__unverified-alert"
            type="error"
          >
            Your account has not been verified!
            <v-btn
              :disabled="resendDisabled"
              size="small"
              variant="outlined"
              @click="onVerificationResend"
            >
              Resend
            </v-btn>
          </v-alert>
          <action-bar right>
            <v-btn :disabled="submitting || !submittable" variant="text" @click="onReset">
              Cancel
            </v-btn>
            <v-btn :disabled="submitting || !submittable" color="primary" @click="onProfileUpdate">
              Update
            </v-btn>
          </action-bar>
        </form>
      </template>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import * as yup from "yup";

// Utilities
import { useAccountVerifyResend, useErrors, useSnackbar } from "@composables";
import { useAccountStore } from "@store";
import { AccountService } from "@services";

export default defineComponent({
  name: "AccountProfile",
  setup() {
    const accountStore = useAccountStore();
    const { resendVerification, resendDisabled } = useAccountVerifyResend();
    const { getError } = useErrors();
    const { notifyError, notifySuccess } = useSnackbar();

    const schema = yup.object({
      name: yup.string().label("Name").min(2).required(),
    });

    const { handleSubmit, isSubmitting, meta, resetForm } = useForm({
      validationSchema: schema,
      initialValues: {
        name: accountStore.account?.name ?? "",
      },
    });
    const submittable = computed(() => meta.value.dirty);
    const submitting = computed(() => isSubmitting.value && meta.value.valid);

    /** Resend account verification email */
    const onVerificationResend = async () => {
      try {
        await resendVerification();
      } catch (e: any) {
        notifyError(getError(e, "Failed to resend verification"));
      }
    };

    /** Update account profile */
    const onProfileUpdate = handleSubmit(async (data): Promise<void> => {
      const { name } = data;

      try {
        await AccountService.updateAccount({ name });
      } catch (e: any) {
        notifyError(getError(e, "Failed to update profile"));

        return;
      }

      notifySuccess("Profile has been updated!");
      resetForm({ values: { name } });
    });

    return {
      account: computed(() => accountStore.account),
      resendDisabled,
      submittable,
      submitting,
      onVerificationResend,
      onReset: () => resetForm(),
      onProfileUpdate,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-card {
  padding: 24px;
}

.profile__form {
  :deep(.v-input__details) {
    margin-bottom: 4px;
  }
}

.profile__label {
  margin-bottom: 4px;
  font-size: 1.1rem;
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

.profile__unverified-prompt {
  margin-top: 24px;
}
</style>
