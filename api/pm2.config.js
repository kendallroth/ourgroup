module.exports = {
  apps: [
    {
      name: "ourgroup-api",
      script: "dist/src/main.js",
      error_file: "/dev/stderr",
      instances: 1,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
