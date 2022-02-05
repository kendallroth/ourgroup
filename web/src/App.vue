<template>
  <v-app theme="light">
    <v-main>
      <the-app-header :loading="loadingAuth" />
      <router-view v-if="!loadingAuth" />
      <div v-else class="app-loader">
        <v-progress-circular color="primary" indeterminte size="80" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

// Components
import { TheAppHeader } from "@components/single";

// Utilities
import { AccountService, AuthService } from "@services";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "App",
  components: {
    TheAppHeader,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const accountStore = useAccountStore();

    /** Whether authentication is loading (MUST start 'true' to avoid double mounting components!) */
    const loadingAuth = ref(true);

    onMounted(async () => {
      loadingAuth.value = true;

      await loadUser();

      loadingAuth.value = false;
    });

    const loadUser = async (): Promise<void> => {
      // Only try fetching authenticated user if all auth tokens are present
      const hasAuthTokens = AuthService.hasAuthTokens();
      if (!hasAuthTokens) {
        loadingAuth.value = false;
        preventRouteAccess();
        return;
      }

      loadingAuth.value = true;

      let user = null;
      try {
        user = await AccountService.fetchAccount();
      } catch (e) {
        console.log("Error loading authenticated user", e);
        loadingAuth.value = false;

        // Auth token should be removed if authentiation fails
        AuthService.removeAuthTokens();

        preventRouteAccess();
        return;
      }

      accountStore.setAccount(user.email);

      loadingAuth.value = false;

      if (!user) return;

      // Redirect away from unauthenticated pages when authenticated
      const { meta } = route;
      if (meta && meta.requiresNoAuth) {
        router.replace("/");
      }
    };

    /**
     * Protect authorized routes if user authentication fails
     */
    const preventRouteAccess = (): void => {
      const { fullPath, matched } = route;

      // Redirect away from authenticated pages if the viewer authentication fails.
      const requiresAuth = matched?.some((m) => m.meta?.requiresAuth);
      if (requiresAuth) {
        router.replace({
          path: "/login",
          query: { redirectUrl: fullPath },
        });

        // TODO: Notify user that they are not authenticated
        console.error("User is not authenticated");
      }
    };

    return {
      loadingAuth,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px;
}

.app-construction__text {
  margin-top: 24px;
}
</style>
