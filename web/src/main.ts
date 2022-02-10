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
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";

loadFonts();

const app = createApp(App);

app.config.globalProperties.$filters = filters;

app.use(router).use(rootPiniaStore).use(vuetify).use(components);

app.mount("#app");
