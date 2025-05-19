var express = require('express');
var router = express.Router();
var climbingCenterController = require('../controllers/climbingCenterController.js');
const auth = require("../middleware/auth");

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
router.get('/:id', climbingCenterController.show); // must be last

/*
 * POST
 */
router.post('/', auth, climbingCenterController.create);
router.post('/byProximity', climbingCenterController.getByProximity);

module.exports = router;
