const Koa      = require('koa');
const app      = new Koa();
const request  = require('request');
const config = require('./config');

const PORT = config.PORT;
const WEATHER_CONSUMER_KEY = config.WEATHER_CONSUMER_KEY;

let clientIP = '';
let lat = '';
let lon = '';

// x-response-time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(async (ctx, next) => {
  // get clientIP from request
  console.log('ctx.request.header[x-forwarded-for]', ctx.request.header['x-forwarded-for']);
  clientIP = ctx.request.header['x-forwarded-for'] || ctx.request.ip; // ctx.request.ip is server - for local dev
  console.log('clientIP', clientIP);
  // get geolocation info from ip-api
  await new Promise((resolve, reject) => {
    request(`http://ip-api.com/json/`, (error, response, body) => {                       // for dev
    // request(`http://ip-api.com/json/${clientIP}`, (error, response, body) => {         // for production
      if (error) {
        console.log('error:', error); // log the error if one occured
      } else {
        console.log('statusCode:', response && response.statusCode); // log the response status code if a response was received
        console.log('body:', body); // log body
        let geolocationData = JSON.parse(body);
        console.log('lat,', geolocationData.lat, ' lon,', geolocationData.lon);
        lat = geolocationData.lat;
        lon = geolocationData.lon;
        console.log(ctx.request);
        resolve();
      }
    });
  });
  await next();
});

app.use(async (ctx, next) => {
  await next();
  ctx.body = `
    Client IP: ${clientIP}
    Client Coordinates: ${lat}, ${lon}`;
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening to port: ${PORT}`);
});