<template>
  <auth-layout>
    <router-view v-slot="{ Component, route }">
      <transition name="slide" mode="out-in">
        <div :key="route" class="auth-router">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </auth-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import AuthLayout from "./components/AuthLayout.vue";

export default defineComponent({
  name: "AuthRouter",
  components: {
    AuthLayout,
  },
});
</script>

<style lang="scss" scoped>
.auth-router {
  flex-grow: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
