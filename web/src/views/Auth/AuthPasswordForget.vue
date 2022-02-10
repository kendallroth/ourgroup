<template>
  <auth-title title="Forgot Password?" />
  <form class="password-forget-form" @submit="onForgetPassword">
    <text-field
      :disabled="submitting || emailSent"
      :hide-details="emailSent"
      autofocus
      density="default"
      label="Email"
      name="email"
    />
    <template v-if="!emailSent">
      <v-btn :disabled="submitting" color="primary" size="large" type="submit">
        Reset Password
      </v-btn>
      <v-btn
        :disabled="submitting"
        block
        class="password-forget-form__login"
        variant="text"
        to="/auth/login"
      >
        Login
      </v-btn>
    </template>
    <template v-else>
      <div class="password-forget-resend">
        <p>A temporary email has been sent with instructions for resetting your password.</p>
        <small>Didn't receive the email yet? Check your spam folder or try resending.</small>
      </div>
      <v-btn :disabled="submitting" class="mt-4" color="primary" to="/auth/login">Sign In</v-btn>
      <v-btn
        :disabled="submitting || resendDisabled"
        class="mt-4"
        color="primary"
        type="submit"
        variant="text"
      >
        Resend Email
      </v-btn>
    </template>
  </form>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import * as yup from "yup";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { PasswordService } from "@services";
import { useCountdown, useErrors, useSnackbar } from "@composables";

export default defineComponent({
  name: "AuthPasswordForget",
  components: {
    AuthTitle,
  },
  setup() {
    const emailSent = ref<boolean>(false);

    const { countdownActive, startCountdown } = useCountdown();
    const { getError } = useErrors();
    const { notifyError, notifySuccess } = useSnackbar();

    const schema = yup.object({
      email: yup.string().label("Email").email().required(),
    });

    const { handleSubmit, isSubmitting, meta } = useForm({
      validationSchema: schema,
      initialValues: {
        email: "",
      },
    });
    const submitting = computed(() => isSubmitting.value && meta.value.valid);

    /** Request a password reset */
    const onForgetPassword = handleSubmit(async (data): Promise<void> => {
      const { email } = data;

      // Notifications are only displayed when resending email
      const resending = Boolean(emailSent.value);

      try {
        const meta = await PasswordService.forgotPasswordRequest(email);
        emailSent.value = true;

        // Prevent user from requesting password resets too quickly
        startCountdown(meta.wait);
      } catch (e: any) {
        notifyError(getError(e, "Failed to request password reset"));
        return;
      }

      if (resending) {
        notifySuccess("Email resent");
      }
    });

    return {
      emailSent,
      resendDisabled: countdownActive,
      submitting,
      onForgetPassword,
    };
  },
});
</script>

<style lang="scss" scoped>
.password-forget-form {
  display: flex;
  flex-direction: column;
}

.password-forget-form__login {
  align-self: center;
  margin-top: 16px;
}

.password-forget-resend {
  margin-top: 16px;

  > * {
    display: block;
    margin-bottom: 16px;
  }
}
</style>
