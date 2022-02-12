<template>
  <div class="title-bar">
    <component :is="type" :class="`title--${type}`">
      <template v-if="title">{{ title }}</template>
      <slot v-else />
    </component>
    <div v-if="$slots.actions" class="title-bar__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export type TitleType = "h1" | "h2" | "h3";

export default defineComponent({
  name: "TitleBar",
  props: {
    /** Title text (can also use children) */
    title: {
      default: null,
      type: String,
    },
    /** Header text type */
    type: {
      required: true,
      type: String as PropType<TitleType>,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@styles/vars";

$item-spacing: 16px;

// Create styles for each typography title type
@each $type, $properties in $text-titles {
  .title--#{$type} {
    font-size: map-get($properties, "size");
    font-weight: map-get($properties, "weight");
    line-height: map-get($properties, "height");
    // text-transform: uppercase;
  }
}

.title-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title-bar__actions {
  margin-left: auto;

  > :not(:last-child) {
    margin-right: $item-spacing;
  }
}
</style>
