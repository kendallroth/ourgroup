import { createRouter, createWebHistory } from "vue-router";

// Utilities
import guards from "./guards";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Hook up router navigation guards
guards(router);

export default router;
export * from "./utilities";
