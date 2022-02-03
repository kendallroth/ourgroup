import dayjs from "dayjs";
import { registerAs } from "@nestjs/config";

// Types
import { IApiConfig } from "../types";

const nodeEnv = process.env.NODE_ENV || "development";

const webAppUrl = process.env.WEB_APP_URL;
if (!webAppUrl) {
  throw new Error("WEB_APP_URL is missing!");
}

const releaseDateEnv = process.env.RELEASE_DATE;
const releaseDate = releaseDateEnv ? dayjs(releaseDateEnv).format("YYYY-MMM-DD HH:mm") : undefined;

const appConfig: IApiConfig = {
  releaseDate,
  releaseHash: process.env.RELEASE_HASH,
  port: parseInt(process.env.PORT as string, 10) || 3001,
  production: nodeEnv === "production",
  webAppUrl,
};

export default registerAs("app", () => ({ ...appConfig }));
