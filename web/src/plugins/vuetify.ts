import { createVuetify, ThemeDefinition } from "vuetify";
import { Intersect } from "vuetify/directives";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi-svg";

// Styles
// NOTE: Importing 'vuetify/styles' will prevent overrides from working!
import "@mdi/font/css/materialdesignicons.css";
import "@styles/vuetify.scss";

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    accent: "#d81159",
    background: "#f9f9f9",
    error: "#AC0D2B",
    info: "#2196F3",
    primary: "#6610f2",
    primaryDark: "#3D1A86",
    primaryLight: "#DFD6F5",
    secondary: "#fbb13c",
    secondaryDark: "#FC7600",
    secondaryLight: "#FFF8E0",
    success: "#287D3C",
    surface: "#ffffff",
    warning: "#B95000",
  },
  variables: {},
};

export default createVuetify({
  defaults: {
    VBtn: {
      rounded: "pill",
    },
  },
  // TODO: Remove once originating bug has been resolved!
  // Source: https://github.com/vuetifyjs/vuetify/issues/14578
  directives: { Intersect },
  icons: {
    aliases,
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
    },
  },
});
