module.exports = {
  apps: [
    {
      name: "image-cdn",
      script: "./dist/index.js",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
