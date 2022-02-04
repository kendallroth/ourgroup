<template>
  <div class="login">
    <div class="login-form">
      <v-text-field v-model="form.fields.email" :disabled="form.flags.submitting" label="Email" />
      <v-text-field
        v-model="form.fields.password"
        :disabled="form.flags.submitting"
        label="Password"
        type="password"
      />
      <v-btn :disabled="form.flags.submitting" block color="primary" @click="onLogin">Submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";

// Utilities
import { AuthService } from "@services";

export default defineComponent({
  name: "AuthLogin",
  setup() {
    const route = useRoute();

    const form = reactive({
      flags: {
        submitting: false,
      },
      fields: {
        email: "",
        password: "",
      },
    });

    /**
     * Login user
     */
    const onLogin = async (): Promise<void> => {
      const { email, password } = form.fields;

      form.flags.submitting = true;

      try {
        await AuthService.login({ email, password });
      } catch (e) {
        // TODO: Handle/detect specific errors

        form.flags.submitting = false;
        console.log("Form error", e);
        return;
      }

      // NOTE: Don't reset submission state before refreshing page!

      // Redirect to previous page (if necessary)
      const { redirectUrl = "/" } = route.query;
      // Force a page refresh to better clean up app state
      window.location.replace(redirectUrl as string);
    };

    return {
      form,
      onLogin,
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
