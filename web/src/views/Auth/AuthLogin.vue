<template>
  <auth-title title="Login" />
  <form class="login-form" @submit="onLogin">
    <text-field :disabled="submitting" autofocus density="default" label="Email" name="email" />
    <text-field
      :disabled="submitting"
      label="Password"
      density="default"
      name="password"
      password
    />
    <v-btn :disabled="submitting" block color="primary" size="large" type="submit">Login</v-btn>
    <v-btn
      :disabled="submitting"
      block
      class="login-form__forgot-password"
      variant="text"
      to="/auth/password/forget"
    >
      Forgot Password?
    </v-btn>
  </form>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import * as yup from "yup";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { AuthService } from "@services";
import { useErrors, useSnackbar } from "@composables";

export default defineComponent({
  name: "AuthLogin",
  components: {
    AuthTitle,
  },
  setup() {
    const hasSubmitted = ref(false);

    const route = useRoute();
    const { getError } = useErrors();
    const { notifyError } = useSnackbar();

    const schema = yup.object({
      email: yup.string().label("Email").email().required(),
      password: yup.string().label("Password").required(),
    });

    const { handleSubmit, isSubmitting, meta, setFieldError } = useForm({
      validationSchema: schema,
      initialValues: {
        email: "",
        password: "",
      },
    });
    const submitting = computed(
      // NOTE: Login submission should not be reset once page reload has been initiated!
      () => (isSubmitting.value && meta.value.valid) || hasSubmitted.value,
    );

    /** Authenticate user and store received credentials */
    const onLogin = handleSubmit(async (data): Promise<void> => {
      const { email, password } = data;

      try {
        await AuthService.login({ email, password });
      } catch (e: any) {
        setFieldError("email", "Invalid credentials");
        notifyError(getError(e, "Failed to login"));
        return;
      }

      // NOTE: Don't reset submission state before refreshing page!
      hasSubmitted.value = true;

      // Redirect to previous page (if necessary)
      const { redirectUrl = "/" } = route.query;
      // Force a page refresh to better clean up app state
      window.location.replace(redirectUrl as string);
    });

    return {
      submitting,
      onLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
}

.login-form__forgot-password {
  align-self: center;
  margin-top: 16px;
}
</style>
