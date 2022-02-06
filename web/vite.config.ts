import path from "path/posix";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "@vuetify/vite-plugin";

export default ({ mode }) => {
  // Load environment variables for access
  const config = loadEnv(mode, process.cwd());

  return defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData(source, fp) {
            // NOTE: Both '@use' and '@forward' rules MUST be some of the first rules
            //         in an SCSS file! Therefore, if the Vuetify overrides has any
            //         SCSS imports prepended, it will break this order and cause errors!
            if (fp.endsWith("vuetify.scss")) return source;

            return `
              @import "@styles/_breakpoints.scss";
              @import "@styles/_vars.scss";
              ${source}
            `;
          }
        }
      }
    },
    plugins: [vue(), vuetify({ autoImport: true, styles: "expose" })],
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@config": path.resolve(__dirname, "src/config.ts"),
        "@plugins": path.resolve(__dirname, "src/plugins"),
        "@router": path.resolve(__dirname, "src/router"),
        "@services": path.resolve(__dirname, "src/services"),
        "@store": path.resolve(__dirname, "src/store"),
        "@styles": path.resolve(__dirname, "src/styles"),
        "@typings": path.resolve(__dirname, "src/types"),
        "@utilities": path.resolve(__dirname, "src/utilities"),
        "@views": path.resolve(__dirname, "src/views"),
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
      // NOTE: Must match web port specified in Dockerfile to avoid Vite server connection issues!
      port: parseInt(config.VITE_PORT, 10),
    },
  });
};
