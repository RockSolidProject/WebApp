var express = require('express');
var router = express.Router();
var climbingCenterController = require('../controllers/climbingCenterController.js');
const auth = require("../middleware/auth");
const routeConnectionController = require("../controllers/routeConnectionController");

/*
 * GET
 */
router.get('/', climbingCenterController.list);

/*
 * GET
 */
router.get('/listMoonboards', climbingCenterController.listMoonboard);
router.get('/listBoulders', climbingCenterController.listBoulders);
router.get('/listRoutes', climbingCenterController.listRoutes);
router.get('/listSprayWalls', climbingCenterController.listSprayWall);
router.get('/find', climbingCenterController.listSearch);
router.get('/:id', climbingCenterController.show); // must be last

/*
 * POST
 */
router.post('/', auth, climbingCenterController.create);
router.post('/byProximity', climbingCenterController.getByProximity);
router.post("/inPolygon", climbingCenterController.getInPolygon);

router.put('/:id', auth, climbingCenterController.update);
router.delete('/:id', auth, climbingCenterController.remove);

module.exports = router;
