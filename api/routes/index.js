const Router = require('koa-router');
const router = new Router();
const api = new Router();

const getRouter = require('./cities/get-router');
// disabling post router until I have adjusted the saving process to also include new geolocation data!
//const postRouter = require('./cities/post-router');

api
    .use(getRouter)
    //.use(postRouter);

router
    .use('/api', api.routes());

module.exports = router;