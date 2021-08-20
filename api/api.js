const Koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();
const router = require('./routes/index');

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app
    .use(cors())
    .use(logger())
    .use(body())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(1337);