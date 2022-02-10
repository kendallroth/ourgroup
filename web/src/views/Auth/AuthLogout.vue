<template>
  <auth-title title="Goodbye!" />
  <div class="logout">
    <v-progress-circular color="primary" indeterminate size="50" />
    <div class="logout-message">Signing out&hellip;</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

// Components
import AuthTitle from "./components/AuthTitle.vue";

// Utilities
import { AuthService } from "@services";

export default defineComponent({
  name: "AuthLogout",
  components: {
    AuthTitle,
  },
  setup() {
    onMounted(() => {
      setTimeout(async () => {
        await AuthService.logout();

        window.location.replace("/auth/login");
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
