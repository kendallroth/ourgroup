<template>
  <app-page>
    <v-card class="not-found">
      <v-img :src="notFoundImg" alt="Page Not Found" class="not-found__image" contain width="400" />
      <h2 class="not-found__title">Something's Missing Here</h2>
      <p class="not-found__text">
        We can't find the page you've requested.<br />It may have moved or no longer exists.
      </p>
      <v-btn class="mt-10" color="primary" size="x-large" rounded="pill" to="/">Home</v-btn>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
  setup() {
    const notFoundImg = new URL("/src/assets/not_found.png", import.meta.url).href;

    return {
      notFoundImg,
    };
  },
});
</script>

<style lang="scss" scoped>
.not-found {
  margin: 64px auto;
  padding: 32px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
}

.not-found__title {
  font-size: 24px;
  font-weight: bold;
}

.not-found__text {
  margin-top: 16px;
  font-size: 16px;
  text-align: center;
}
</style>
