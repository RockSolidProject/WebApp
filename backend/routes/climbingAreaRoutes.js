var express = require('express');
var router = express.Router();
var climbingAreaController = require('../controllers/climbingAreaController.js');
var auth = require("../middleware/auth.js");
const { listRoutes } = require('../controllers/climbingCenterController.js');

/*
 * GET
 */
router.get('/', climbingAreaController.list);

/*
 * GET
 */
router.get('/find', climbingAreaController.listSearch)
router.get('/:id', climbingAreaController.show);

/*
 * POST
 */
router.post('/', auth, climbingAreaController.create);
router.post('/byProximity', climbingAreaController.getByProximity);
router.post("/inPolygon", climbingAreaController.getInPolygon);

router.put('/:id', auth, climbingAreaController.update);
router.delete('/:id', auth, climbingAreaController.delete);

module.exports = router;
