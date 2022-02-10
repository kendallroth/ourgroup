import { createPinia } from "pinia";

// Utilities
import { useAccountStore } from "./account.store";

const rootPiniaStore = createPinia();

export { rootPiniaStore, useAccountStore };
