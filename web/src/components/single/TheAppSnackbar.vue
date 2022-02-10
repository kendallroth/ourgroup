<template>
  <div class="snackbar-container">
    <transition name="snackbar-toggle">
      <div
        v-show="snackbar.visible"
        :class="{
          'is-error': snackbar.type === 'error',
          'is-success': snackbar.type === 'success',
          'is-warning': snackbar.type === 'warning',
        }"
        class="snackbar elevation-2"
      >
        <div class="snackbar__text">{{ snackbar.text }}</div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Utilities
import { useSnackbar } from "@composables/snackbar";

export default defineComponent({
  name: "TheAppSnackbar",
  setup() {
    const { snackbar } = useSnackbar();

    return {
      snackbar,
    };
  },
});
</script>

<style lang="scss" scoped>
.snackbar-container {
  position: fixed;
  overflow: hidden;

  bottom: 8px;
  left: 8px;
}

.snackbar {
  display: inline-flex;
  align-items: center;

  min-width: 288px;
  max-width: 568px;
  min-height: 48px;

  padding: 14px 24px;
  margin: 4px 4px 8px 4px;

  border-radius: 2px;
  background-color: #323232;

  &.is-error {
    background-color: rgb(var(--v-theme-error));
  }
  &.is-success {
    background-color: rgb(var(--v-theme-success));
  }
  &.is-warning {
    background-color: rgb(var(--v-theme-warning));
  }
}

.snackbar__text {
  font-size: 14px;
  color: white;
}

.snackbar-toggle-enter-active,
.snackbar-toggle-leave-active {
  transition: transform 0.3s ease;
}

.snackbar-toggle-enter-from,
.snackbar-toggle-leave-to {
  transform: translateY(60px);

  /*.snackbar-text {
    opacity: 0;
  }*/
}
</style>
