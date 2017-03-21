const Koa = require('koa');
const app = new Koa();

const PORT = process.env.PORT || 5000;

// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  const clientIP = ctx.request.ip;
  console.log(clientIP);
  ctx.body = `Client IP: ${clientIP}`;
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening to port: ${PORT}`);
});