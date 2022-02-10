<template>
  <h2 class="auth-layout__title" type="h2">{{ title }}</h2>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthTitle",
  props: {
    title: {
      required: true,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.auth-layout__title {
  width: 100%;
  margin-bottom: #{$spacing * 4}px;
  text-align: center;
}
</style>
