<template>
  <div class="logout">
    <v-progress-circular color="primary" indeterminate size="50" />
    <div class="logout-message">Signing out&hellip;</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

// Utilities
import { AuthService } from "@services";

export default defineComponent({
  name: "AuthLogout",
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
  width: 100%;
  height: 100%;
  margin: 32px 0;
}

.logout-message {
  margin-top: 32px;
  font-size: 1.5rem;
}
</style>
