module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { console: false };

    return config;
  },
}
