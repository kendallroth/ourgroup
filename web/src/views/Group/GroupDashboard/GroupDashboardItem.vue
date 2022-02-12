<template>
  <v-list-item @click="$emit('select')">
    <v-list-item-avatar left>
      <v-checkbox hide-details :model-value="selected" />
    </v-list-item-avatar>
    <v-list-item-header>
      <v-list-item-title class="group-item__title">{{ group.name }}</v-list-item-title>
      <v-list-item-subtitle class="group-item__slug">{{ group.slug }}</v-list-item-subtitle>
    </v-list-item-header>
    <v-list-item-avatar right>
      <v-btn icon flat size="small">
        <v-icon
          :color="group.favourite ? 'accent' : undefined"
          :icon="group.favourite ? icons.starFilled : icons.starEmpty"
        />
      </v-btn>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mdiStar, mdiStarOutline } from "@mdi/js";

// Types
import { IGroup } from "@typings/group.types";

export default defineComponent({
  name: "GroupDashboardItem",
  props: {
    group: {
      required: true,
      type: Object as PropType<IGroup>,
    },
    selected: {
      default: false,
      type: Boolean,
    },
  },
  emits: {
    select() {
      return true;
    },
  },
  setup() {
    const icons = {
      starEmpty: mdiStarOutline,
      starFilled: mdiStar,
    };

    return {
      icons,
    };
  },
});
</script>

<scss lang="scss">
.group-item {
}

.group-item__title {
  font-weight: 600;
}

.group-item__slug {
  font-family: monospace;
}
</scss>
