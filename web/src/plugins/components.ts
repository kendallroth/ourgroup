import { App } from "vue";

// Components
import { TextField } from "@components/form";
import { ActionBar, AppPage } from "@components/layout";
import { TitleBar } from "@components/typography";

export default {
  install: (app: App) => {
    // Layout
    app.component("ActionBar", ActionBar);
    app.component("AppPage", AppPage);

    // Forms
    app.component("TextField", TextField);

    // Typography
    app.component("TitleBar", TitleBar);
  },
};
