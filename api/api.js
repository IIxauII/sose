const Koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-body');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = require('./routes/index');
const db = new Map();
let httpsConfig;
let appCallBack;
let enableHttps = false;

if (process.argv.length === 3 && process.argv[2] === 'https') {
    console.log('enabling https');
    enableHttps = true;
}

if (enableHttps) {
    httpsConfig = {
        domain: 'sose.bounceme.net',
        https: {
            port: 1337,
            options: {
                key: fs.readFileSync(path.resolve(process.cwd(), '../certs/privkey.pem'), 'utf8').toString(),
                cert: fs.readFileSync(path.resolve(process.cwd(), '../certs/fullchain.pem'), 'utf8').toString(),
            },
        },
    };
    appCallBack = app.callback();
}


app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app
    .use(cors())
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
    .use(logger())
    .use(body())
    .use(router.routes())
    .use(router.allowedMethods());

if (enableHttps) {
    try {
        const HttpsApp = https.createServer(httpsConfig.https.options, appCallBack);
        HttpsApp.listen(httpsConfig.https.port, (err) => {
            if (!!err) {
                console.error('HTTPS app fail', err);
            } else {
                console.log(`HTTPS app ok: https://${httpsConfig.domain}:${httpsConfig.https.port}`);
            }
        })
    
    } catch(err) {
        console.error('HTTPS app start failed', err);
    }
} else {
    app.listen(1336);
}
