<template>
  <v-main :class="backgroundClass">
    <v-container
      :class="{ 'container--no-padding': !padding }"
      :fluid="fluid"
      class="page-layout__container"
    >
      <v-row align="center" class="page-layout__row" no-gutters>
        <v-col v-bind="columnProps">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

interface IColumnSize {
  cols: number;
  sm?: number;
  "offset-sm"?: number;
  md?: number;
  "offset-md"?: number;
  lg?: number;
  "offset-lg"?: number;
  xl?: number;
  "offset-xl"?: number;
}

// Components
export default defineComponent({
  name: "AppPage",
  props: {
    /** Background class (useful for page backgrounds, etc) */
    backgroundClass: {
      default: "",
      type: String,
    },
    /** Whether content is centered on page */
    center: {
      default: false,
      type: Boolean,
    },
    /** Additional customization for column sizes */
    columns: {
      type: Object,
      default: () => ({}),
    },
    /** Whether container should be fluid (fullscreen) */
    fluid: {
      default: false,
      type: Boolean,
    },
    /** Whether default columns are ignored (overrides size) */
    ignoreColumns: {
      default: false,
      type: Boolean,
    },
    /** Whether container provides padding */
    padding: {
      default: true,
      type: Boolean,
    },
    /** Container size preset */
    size: {
      default: "medium",
      type: String,
    },
  },
  setup(props) {
    const columnProps = computed(() => {
      const { columns, ignoreColumns, size } = props;

      if (ignoreColumns) {
        return { cols: 12, offset: 0 };
      }

      let defaultColumns: IColumnSize = {
        cols: 12,
      };

      if (size === "small") {
        defaultColumns = {
          ...defaultColumns,
          sm: 6,
          "offset-sm": 3,
          xl: 4,
          "offset-xl": 4,
        };
      } else if (size === "medium") {
        defaultColumns = {
          ...defaultColumns,
          sm: 10,
          "offset-sm": 1,
          xl: 8,
          "offset-xl": 2,
        };
      } else if (size == "large") {
        defaultColumns = {
          ...defaultColumns,
          sm: 12,
          xl: 10,
          "offset-xl": 1,
        };
      }

      const overrideColumns = columns;
      const mergedColumns = {
        ...defaultColumns,
        ...overrideColumns,
      };

      return mergedColumns;
    });

    return {
      columnProps,
    };
  },
});
</script>
