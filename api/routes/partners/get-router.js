const Router = require('koa-router');
const ctrl = require('../../controllers/partners/get-controller');
const router = new Router();

router.get('/partners', ctrl.getPartners);
router.get('/partners/nearest', ctrl.getNearestPartners);

module.exports = router.routes();