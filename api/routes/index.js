const Router = require('koa-router');
const router = new Router();
const api = new Router();

const getRouter = require('./cities/get-router');

api
    .use(getRouter);

router
    .use('/api', api.routes());

module.exports = router;