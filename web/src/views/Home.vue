<template>
  <app-page>
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
  </app-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHome",
  setup() {
    const underConstructionImg = new URL("/src/assets/under_construction.png", import.meta.url)
      .href;

    return {
      underConstructionImg,
    };
  },
});
</script>

<scss lang="scss">
.app-construction {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</scss>
