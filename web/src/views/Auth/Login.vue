<template>
  <div class="login">
    <form class="login-form" @submit="onLogin">
      <text-field :disabled="submitting" autofocus density="default" label="Email" name="email" />
      <text-field :disabled="submitting" label="Password" density="default" name="password" />
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
  </div>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import * as yup from "yup";

// Components
import { TextField } from "@components/form";

// Utilities
import { AuthService } from "@services";

export default defineComponent({
  name: "AuthLogin",
  components: {
    TextField,
  },
  setup() {
    const route = useRoute();
    const hasSubmitted = ref(false);

    const schema = yup.object({
      email: yup.string().label("Email").required().email(),
      password: yup.string().label("Password").required().min(8),
    });

    const { handleSubmit, isSubmitting, meta, values } = useForm({
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
     * Login user
     */
    const onLogin = async (data: typeof values): Promise<void> => {
      const { email, password } = data;

      try {
        await AuthService.login({ email, password });
      } catch (e) {
        // TODO: Handle/detect specific errors

        console.log("Form error", e);
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
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form {
  margin: 64px 0;
  width: 100%;
  max-width: 400px;
}
</style>
