<template>
  <v-app class="app" theme="light">
    <the-app-header :loading="loadingAuth" />
    <router-view v-if="!loadingAuth" />
    <div v-else class="app-loader">
      <v-progress-circular color="primary" indeterminate size="80" />
    </div>
    <the-app-snackbar />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

// Components
import { TheAppHeader, TheAppSnackbar } from "@components/single";

// Utilities
import { useSnackbar } from "@composables";
import { AccountService, AuthService } from "@services";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "App",
  components: {
    TheAppHeader,
    TheAppSnackbar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const accountStore = useAccountStore();
    const { notifyError } = useSnackbar();

    /** Whether authentication is loading (MUST start 'true' to avoid double mounting components!) */
    const loadingAuth = ref(true);

    onMounted(async () => {
      loadingAuth.value = true;

      await loadAccount();

      loadingAuth.value = false;
    });

    /** Load account information (if previously authenticated) */
    const loadAccount = async (): Promise<void> => {
      // Only try fetching authenticated account if all auth tokens are present
      const hasAuthTokens = AuthService.hasAuthTokens();
      if (!hasAuthTokens) {
        loadingAuth.value = false;
        preventRouteAccess();
        return;
      }

      loadingAuth.value = true;

      let account = null;
      try {
        account = await AccountService.fetchAccount();
      } catch (e) {
        loadingAuth.value = false;

        // Auth token should be removed if authentiation fails
        AuthService.removeAuthTokens();

        preventRouteAccess();
        return;
      }

      // Initiate automatic refresh cycles to prevent token expiry, although it is
      //   already handled retroactively with Axios interceptors (better experience).
      AuthService.refreshTokens().catch(() => {
        // TODO: Determine how to handle error while auto-refreshing auth tokens
      });

      accountStore.setAccount(account);

      loadingAuth.value = false;

      if (!account) return;

      // Redirect away from unauthenticated pages when authenticated
      const { meta } = route;
      if (meta && meta.requiresNoAuth) {
        router.replace("/");
      }
    };

    /** Protect authorized routes if user authentication fails */
    const preventRouteAccess = (): void => {
      const { fullPath, matched } = route;

      // Redirect away from authenticated pages if the viewer authentication fails.
      const requiresAuth = matched?.some((m) => m.meta?.requiresAuth);
      if (requiresAuth) {
        router.replace({
          path: "/auth/login",
          query: { redirectUrl: fullPath },
        });

        notifyError("Account is not authenticated");
      }
    };

    return {
      loadingAuth,
    };
  },
});
</script>

<style lang="scss" scoped>
.app {
  flex-grow: 1;
  min-height: 100vh;
}

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
