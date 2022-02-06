import { createApp } from "vue";

// Components
import App from "./App.vue";

// Utilities
import components from "@plugins/components";
import filters from "@plugins/filters";
import vuetify from "@plugins/vuetify";
import { loadFonts } from "@plugins/webfontloader";
import router from "@router";
import { rootPiniaStore } from "@store";

// Styles
import "@styles/app.scss";

loadFonts();

const app = createApp(App);

app.config.globalProperties.$filters = filters;

app.use(router).use(rootPiniaStore).use(vuetify).use(components);

app.mount("#app");
