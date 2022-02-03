import { createApp } from "vue";

// Components
import App from "./App.vue";

// Utilities
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp(App).use(vuetify).mount("#app");
