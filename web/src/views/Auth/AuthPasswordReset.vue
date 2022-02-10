<template>
  <auth-title title="Reset Password" />
  <form class="password-reset-form" @submit="onForgetPassword">
    <text-field
      :disabled="submitting"
      autofocus
      density="default"
      label="Password"
      name="password"
      password
    />
    <v-btn :disabled="submitting" color="primary" size="large" type="submit">
      Reset Password
    </v-btn>
  </form>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { PasswordService } from "@services";
import { useErrors, useSnackbar } from "@composables";

export default defineComponent({
  name: "AuthPasswordReset",
  components: {
    AuthTitle,
  },
  setup() {
    const { getError, hasError } = useErrors();
    const { notifyError, notifySuccess } = useSnackbar();
    const route = useRoute();
    const router = useRouter();

    const schema = yup.object({
      password: yup.string().label("Password").required(),
    });

    const { handleSubmit, isSubmitting, meta, setFieldError } = useForm({
      validationSchema: schema,
      initialValues: {
        password: "",
      },
    });
    const submitting = computed(() => isSubmitting.value && meta.value.valid);

    /** Reset password (requires verification code) */
    const onForgetPassword = handleSubmit(async (data): Promise<void> => {
      const { code } = route.params;
      const { password } = data;

      try {
        await PasswordService.forgotPasswordReset({
          code: code as string,
          password,
        });
      } catch (e: any) {
        if (hasError(e, "CHANGE_PASSWORD__PASSWORD_MATCHES_OLD")) {
          setFieldError("password", "Password cannot match last password");
        }

        notifyError(getError(e, "Failed to reset password"));
        return;
      }

      notifySuccess("Password has been reset");

      router.replace("/auth/login");
    });

    return {
      submitting,
      onForgetPassword,
    };
  },
});
</script>

<style lang="scss" scoped>
.password-reset-form {
  display: flex;
  flex-direction: column;
}
</style>
