<template>
  <v-app-bar app class="app-header" color="primary">
    <div class="app-header__content">
      <v-img
        :src="logoImg"
        alt="App Logo"
        class="app-header__logo"
        contain
        height="48"
        width="48"
      />
      <v-app-bar-title class="app-header__text">OurGroup</v-app-bar-title>
      <div class="app-header__version">v{{ appVersion }}</div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Utilities
import config from "@config";

export default defineComponent({
  name: "TheAppHeader",
  setup() {
    const logoImg = new URL("/src/assets/logo.png", import.meta.url).href;

    return {
      appVersion: config.app.version,
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

  :deep img {
    padding: 6px;
  }
}

.app-header__text {
}

.app-header__version {
  margin-left: auto;
  font-size: 0.85rem;
  font-family: monospace;
  opacity: 0.8;
}
</style>
