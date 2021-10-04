const Router = require('koa-router');
const ctrl = require('../../controllers/cities/post-controller');
const router = new Router();

router.post('/cities/:name', ctrl.addCity);

module.exports = router.routes();