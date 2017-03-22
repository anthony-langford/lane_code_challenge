const Koa      = require('koa');
const app      = new Koa();
const request  = require('request');

const PORT = process.env.PORT || 5000;

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
  console.log('ctx', ctx);
  clientIP = ctx.request.ip;
  console.log('clientIP', clientIP);
  // get geolocation info from ip-api
  await new Promise((resolve, reject) => {
    request(`http://ip-api.com/json/`, (error, response, body) => {
      if (error) {
        console.log('error:', error); // log the error if one occured
      } else {
        console.log('statusCode:', response && response.statusCode); // log the response status code if a response was received
        console.log('body:', body); // log body
        let geolocationData = JSON.parse(body);
        console.log('lat,', geolocationData.lat, ' lon,', geolocationData.lon);
        lat = geolocationData.lat;
        lon = geolocationData.lon;
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