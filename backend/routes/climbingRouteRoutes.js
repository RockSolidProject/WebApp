var express = require('express');
var router = express.Router();
var climbingRouteController = require('../controllers/climbingRouteController.js');

/*
 * GET
 */
router.get('/', climbingRouteController.list);

/*
 * GET
 */
router.get('/:id', climbingRouteController.show);

/*
 * POST
 */
router.post('/', climbingRouteController.create);

module.exports = router;
