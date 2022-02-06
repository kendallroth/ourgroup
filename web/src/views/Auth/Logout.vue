<template>
  <auth-layout title="Goodbye!">
    <div class="logout">
      <v-progress-circular color="primary" indeterminate size="50" />
      <div class="logout-message">Signing out&hellip;</div>
    </div>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

// Components
import AuthLayout from "./components/AuthLayout.vue";

// Utilities
import { AuthService } from "@services";

export default defineComponent({
  name: "AuthLogout",
  components: {
    AuthLayout,
  },
  setup() {
    onMounted(() => {
      setTimeout(async () => {
        await AuthService.logout();

        window.location.replace("/login");
      }, 1000);
    });

    return {};
  },
});
</script>

<style lang="scss" scoped>
.logout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logout-message {
  margin-top: 32px;
  font-size: 1.25rem;
}
</style>
