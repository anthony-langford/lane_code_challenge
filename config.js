const configs = {
  development: {
    PORT: 5000,
    WEATHER_CONSUMER_KEY: '54ea65e1ad35f8f828b431a625e8e665'
  },
  production: {
    PORT: process.env.PORT,
    WEATHER_CONSUMER_KEY: process.env.WEATHER_CONSUMER_KEY
  }
};

module.exports = configs[process.env.NODE_ENV || 'development'];