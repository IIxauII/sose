const Router = require('koa-router');
const router = new Router();
const api = new Router();

const getRouter = require('./cities/get-router');
const postRouter = require('./cities/post-router');

api
    .use(getRouter)
    .use(postRouter);

router
    .use('/api', api.routes());

module.exports = router;