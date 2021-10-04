const Koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-body');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');

const app = new Koa();
const router = require('./routes/index');
const db = new Map();

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app
    .use(ratelimit({
        driver: 'memory',
        db: db,
        duration: 10000,
        errorMessage: '😴 chill out 💤',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaning',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 5,
        disableHeader: true, // custom headers are kinda wonky
        whitelist: (ctx) => {
            return false;
        },
        blacklist: (ctx) => {
            return false;
        },
    }))
    .use(cors())
    .use(logger())
    .use(body())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(1337);