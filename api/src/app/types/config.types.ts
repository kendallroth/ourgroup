/** API config */
export interface IApiConfig {
  /** API port */
  port: number;
  /** Whether API is in a production environment */
  production: boolean;
  /** Release date */
  releaseDate?: string;
  /** Git commit hash */
  releaseHash?: string;
  /** Web app URL */
  webAppUrl: string;
}
