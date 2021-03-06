<template>
  <auth-title title="Create Account" />
  <form class="register-form" @submit="onCreateAccount">
    <text-field :disabled="submitting" autofocus density="default" label="Name" name="name" />
    <text-field :disabled="submitting" density="default" label="Email" name="email" />
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
      @click="onCreateAccount"
    >
      Create Account
    </v-btn>
  </form>
</template>

<script lang="ts">
import { useForm } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import * as yup from "yup";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { useErrors, useSnackbar } from "@composables";
import { AccountService } from "@services";
import { PASSWORD_REGEX } from "@utilities/validation.util";

export default defineComponent({
  name: "AuthRegister",
  components: {
    AuthTitle,
  },
  setup() {
    const hasSubmitted = ref(false);

    const { getError, hasError } = useErrors();
    const { notifyError } = useSnackbar();

    const schema = yup.object({
      email: yup.string().label("Email").email().required(),
      name: yup.string().label("Name").min(4).required(),
      password: yup
        .string()
        .label("Password")
        .min(8)
        .matches(PASSWORD_REGEX, "Password is invalid")
        .required(),
    });

    const { handleSubmit, isSubmitting, meta, setFieldError } = useForm({
      validationSchema: schema,
      initialValues: {
        email: "",
        name: "",
        password: "",
      },
    });
    const submitting = computed(
      // NOTE: Login submission should not be reset once page reload has been initiated!
      () => (isSubmitting.value && meta.value.valid) || hasSubmitted.value,
    );

    /** Create a new account (requires verification) */
    const onCreateAccount = handleSubmit(async (data): Promise<void> => {
      const { email, name, password } = data;

      try {
        await AccountService.createAccount({
          email,
          name,
          password,
        });
      } catch (e: any) {
        if (hasError(e, "REGISTER__EMAIL_ALREADY_USED")) {
          setFieldError("email", "Email already registered");
        }

        notifyError(getError(e, "Failed to login"));
        return;
      }

      // NOTE: Don't reset submission state before refreshing page!
      hasSubmitted.value = true;

      // Force a page refresh to better clean up app state
      window.location.replace("/");
    });

    return {
      submitting,
      onCreateAccount,
    };
  },
});
</script>

<style lang="scss" scoped>
.register-form {
}
</style>
