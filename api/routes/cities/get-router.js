const Router = require('koa-router');
const ctrl = require('../../controllers/cities/get-controller');
const router = new Router();

router.get('/cities', ctrl.getCities);
router.get('/cities/:name', ctrl.getCity);

module.exports = router.routes();