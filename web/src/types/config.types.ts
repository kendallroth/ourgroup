/** Web application configuration */
export interface IWebConfig {
  /** API configuration */
  api: IWebApiConfig;
  /** App configuration */
  app: IWebAppConfig;
}

/** App-specific configuration */
export interface IWebAppConfig {
  /** App environment name */
  envName: string;
  /** Whether app is deployed in production environment */
  production: boolean;
  /** Web app version */
  version: string;
}

/** API-specific configuration */
export interface IWebApiConfig {
  /** API url base */
  url: string;
}
