import { createApp } from "vue";

// Components
import App from "./App.vue";

// Utilities
import vuetify from "@plugins/vuetify";
import { loadFonts } from "@plugins/webfontloader";
import router from "@router";
import { rootPiniaStore } from "@store";

loadFonts();

createApp(App).use(router).use(rootPiniaStore).use(vuetify).mount("#app");
