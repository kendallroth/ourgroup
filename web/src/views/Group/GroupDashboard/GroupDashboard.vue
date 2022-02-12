<template>
  <app-page size="small">
    <title-bar class="my-4" title="My Groups" type="h1">
      <template #actions>
        <v-btn color="primary" variant="outlined">
          <v-icon :icon="icons.add" left />
          New Group
        </v-btn>
      </template>
    </title-bar>
    <v-card class="group-dashboard__list" rounded="lg">
      <v-list>
        <group-dashboard-item v-for="group in groups" :key="group.id" :group="group" />
      </v-list>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mdiPlus } from "@mdi/js";

// Components
import GroupDashboardItem from "./GroupDashboardItem.vue";

// Types
import { IGroup } from "@typings/group.types";

export default defineComponent({
  name: "GroupDashboard",
  components: {
    GroupDashboardItem,
  },
  setup() {
    const groups: IGroup[] = [
      { id: "1", favourite: false, name: "Placeholder Group", slug: "placeholder-slug@mygroup.ca" }, // prettier-ignore
      { id: "2", favourite: true, name: "Placeholder Group", slug: "placeholder-group-slug@mygroup.ca" }, // prettier-ignore
    ];

    const icons = {
      add: mdiPlus,
    };

    return {
      groups,
      icons,
    };
  },
});
</script>

<scss lang="scss" scoped>
.group-dashboard__list {
  border-radius: 8px;
}
</scss>
