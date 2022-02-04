<template>
  <div class="app-construction">
    <v-img
      :src="underConstructionImg"
      alt="Under Construction"
      class="app-construction__image"
      contain
      width="500"
    />
    <h2 class="app-construction__text">Under Construction!</h2>
    <v-alert :type="authenticated ? 'success' : 'error'" border="start" class="mt-4">
      {{ authenticated ? "Authenticated!" : "Unauthenticated" }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

// Utilities
import { useAccountStore } from "@store";

export default defineComponent({
  name: "AppHome",
  setup() {
    const accountStore = useAccountStore();

    const authenticated = computed(() => accountStore.authenticated);

    const underConstructionImg = new URL("/src/assets/under_construction.png", import.meta.url)
      .href;

    return {
      authenticated,
      underConstructionImg,
    };
  },
});
</script>
