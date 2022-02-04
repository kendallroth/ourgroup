<template>
  <v-app-bar app class="app-header" color="primary">
    <div class="app-header__content">
      <router-link to="/">
        <v-img
          :src="logoImg"
          alt="App Logo"
          class="app-header__logo"
          contain
          height="48"
          width="48"
        />
      </router-link>
      <v-app-bar-title class="app-header__text">OurGroup</v-app-bar-title>
      <div class="app-header__version">v{{ appVersion }}</div>
      <template v-if="authenticated">
        <div class="mr-4">{{ account }}</div>
        <v-btn to="/logout">Logout</v-btn>
      </template>
      <template v-else>
        <v-btn to="/login">Login</v-btn>
      </template>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

// Utilities
import config from "@config";
import { useAccountStore } from "@store";

export default defineComponent({
  name: "TheAppHeader",
  setup() {
    const accountStore = useAccountStore();

    const account = computed(() => accountStore.account);
    const authenticated = computed(() => accountStore.authenticated);

    const logoImg = new URL("/src/assets/logo.png", import.meta.url).href;

    return {
      account,
      appVersion: config.app.version,
      authenticated,
      logoImg,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
}

.app-header__content {
  display: flex;
  align-items: center;
  width: 100%;
  // max-width: #{$breakpoint-lg}px;
  margin: 0 auto;
  padding: 0 16px;
}

.app-header__logo {
  flex-shrink: 0;
  flex-grow: 0;
  background-color: white;
  border-radius: 50%;

  :deep(img) {
    padding: 6px;
  }
}

.app-header__text {
}

.app-header__version {
  margin-left: 16px;
  margin-right: auto;
  font-size: 0.85rem;
  font-family: monospace;
  opacity: 0.8;
}
</style>
