const configs = {
  production: {
    PORT: process.env.PORT,
    WEATHER_CONSUMER_KEY: process.env.WEATHER_CONSUMER_KEY
  }
};

module.exports = configs[process.env.NODE_ENV];