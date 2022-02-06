import { App } from "vue";

// Components
import { TextField } from "@components/form";
import { AppPage } from "@components/layout";

export default {
  install: (app: App) => {
    app.component("AppPage", AppPage);
    app.component("TextField", TextField);
  },
};
