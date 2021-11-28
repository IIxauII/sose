const Router = require('koa-router');
const router = new Router();
const api = new Router();

const citiesGetRouter = require('./cities/get-router');
// disabling post router until I have adjusted the saving process to also include new geolocation data!
//const postRouter = require('./cities/post-router');
const partnersGetRouter = require('./partners/get-router');

api
    .use(citiesGetRouter)
    //.use(postRouter)
    .use(partnersGetRouter);

router
    .use('/api', api.routes());

module.exports = router;