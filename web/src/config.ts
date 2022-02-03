// Utilities
import { version } from "../package.json";

// Types
import { IWebConfig } from "@typings/config.types";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error("API url is missing!");
}

const webConfig: IWebConfig = {
  api: {
    url: apiUrl as string,
  },
  app: {
    envName: (import.meta.env.VITE_ENV_NAME as string) ?? "local",
    production: import.meta.env.NODE_ENV === "production",
    version,
  },
};

export default webConfig;
