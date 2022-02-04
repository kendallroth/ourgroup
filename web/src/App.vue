<template>
  <v-app theme="light">
    <v-main>
      <the-app-header />
      <div class="app-construction">
        <v-img
          :src="underConstructionImg"
          alt="Under Construction"
          class="app-construction__image"
          contain
          width="500"
        />
        <h2 class="app-construction__text">Under Construction!</h2>
      </div>
      <div class="app-debug">
        <v-card v-if="!loadingApi" class="app-debug__card" color="success">
          <div class="app-debug__api-version">API: v{{ apiVersion }}</div>
        </v-card>
        <v-progress-circular v-else color="success" indeterminate size="24" width="2" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

// Components
import { TheAppHeader } from "@components/single";

// Utilities
import { ApiService } from "@services";

export default defineComponent({
  name: "App",
  components: {
    TheAppHeader,
  },
  setup() {
    const loadingApi = ref(false);
    const apiVersion = ref<string>("N/A");

    const underConstructionImg = new URL("/src/assets/under_construction.png", import.meta.url)
      .href;

    onMounted(async () => {
      loadingApi.value = true;

      const info = await ApiService.getApiInfo();
      apiVersion.value = info.version ?? "N/A";

      loadingApi.value = false;
    });

    return {
      apiVersion,
      loadingApi,
      underConstructionImg,
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

.app-debug {
  position: fixed;
  bottom: 24px;
  left: 24px;
}

.app-debug__card {
  padding: 8px 12px;
}

.app-debug__api-version {
  font-size: 0.85rem;
  font-family: monospace;
  opacity: 0.8;
}
</style>
