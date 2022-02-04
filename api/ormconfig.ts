/** Must use dedicated file so CLI can detect config */

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  url: process.env.DATABASE_URL,

  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  },

  cli: {
    // TODO: See if we can use dist?
    migrationsDir: "src/migrations",
  },
  entities: ["dist/**/*.entity.{ts,js}"],
  migrations: ["dist/src/migrations/*!(*.d).{ts,js}"],
  migrationsTableName: "migrations",
  type: "postgres",
};
