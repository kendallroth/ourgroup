<template>
  <auth-layout title="Login">
    <form class="login-form" @submit="onLogin">
      <text-field :disabled="submitting" autofocus density="default" label="Email" name="email" />
      <text-field
        :disabled="submitting"
        label="Password"
        density="default"
        name="password"
        password
      />
      <v-btn
        :disabled="submitting"
        block
        color="primary"
        size="large"
        type="submit"
        @click="onLogin"
      >
        Login
      </v-btn>
    </form>
  </auth-layout>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import * as yup from "yup";

// Components
import AuthLayout from "./components/AuthLayout.vue";

// Utilities
import { AuthService } from "@services";
import { useErrors, useSnackbar } from "@composables";

export default defineComponent({
  name: "AuthLogin",
  components: {
    AuthLayout,
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

    const { handleSubmit, isSubmitting, meta, setFieldError, values } = useForm({
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

    /**
     * Authenticate user and store received credentials
     */
    const onLogin = async (data: typeof values): Promise<void> => {
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
    };

    return {
      submitting,
      onLogin: handleSubmit(onLogin),
    };
  },
});
</script>

<style lang="scss" scoped>
.login-form {
}
</style>
