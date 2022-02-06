import filters from "@plugins/filters";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $filters: typeof filters;
  }
}
