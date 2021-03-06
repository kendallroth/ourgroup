<template>
  <app-page size="small">
    <title-bar class="my-4" title="Settings" type="h1" />
    <v-card class="settings-card">
      <title-bar class="mb-6" title="Change Password" type="h3" />
      <form class="change-password-form" @submit="onPasswordChange">
        <v-container>
          <v-row>
            <v-col>
              <text-field :disabled="submitting" label="Old password" name="oldPassword" password />
            </v-col>
            <v-col>
              <text-field :disabled="submitting" label="New password" name="newPassword" password />
            </v-col>
          </v-row>
        </v-container>
        <action-bar right>
          <v-btn :disabled="submitting || !submittable" variant="text" @click="onReset">
            Cancel
          </v-btn>
          <v-btn :disabled="submitting || !submittable" color="primary" type="submit">
            Change Password
          </v-btn>
        </action-bar>
      </form>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import * as yup from "yup";

// Utilities
import { PasswordService } from "@services";
import { useAccountStore } from "@store";
import { useErrors, useSnackbar } from "@composables";
import { PASSWORD_REGEX } from "@utilities/validation.util";

export default defineComponent({
  name: "AccountSettings",
  setup() {
    const accountStore = useAccountStore();
    const { getError, hasError } = useErrors();
    const { notifyError, notifySuccess } = useSnackbar();

    const schema = yup.object({
      newPassword: yup
        .string()
        .label("Password")
        .min(8)
        .matches(PASSWORD_REGEX, "Password is invalid")
        .required(),
      oldPassword: yup.string().label("Current password").required(),
    });

    const { handleSubmit, isSubmitting, meta, resetForm, setFieldError } = useForm({
      validationSchema: schema,
      initialValues: {
        newPassword: "",
        oldPassword: "",
      },
    });
    const submittable = computed(() => meta.value.dirty);
    const submitting = computed(() => isSubmitting.value && meta.value.valid);

    /** Change current account password */
    const onPasswordChange = handleSubmit(async (data): Promise<void> => {
      const { newPassword, oldPassword } = data;

      try {
        await PasswordService.changePassword({ newPassword, oldPassword });
      } catch (e: any) {
        if (hasError(e, "CHANGE_PASSWORD__WRONG_PASSWORD")) {
          setFieldError("oldPassword", "Password is incorrect");
        }
        if (hasError(e, "CHANGE_PASSWORD__PASSWORD_MATCHES_OLD")) {
          setFieldError("newPassword", "Password cannot match old password");
        }

        notifyError(getError(e, "Failed to change password"));

        return;
      }

      notifySuccess("Password has been changed");
      resetForm();
    });

    return {
      account: computed(() => accountStore.account),
      submittable,
      submitting,
      onPasswordChange,
      onReset: () => resetForm(),
    };
  },
});
</script>

<style lang="scss" scoped>
.settings-card {
  padding: 24px;
}
.change-password-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > .v-container {
    padding: 0;
  }
}
</style>
