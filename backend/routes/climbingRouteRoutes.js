var express = require('express');
var router = express.Router();
var climbingRouteController = require('../controllers/climbingRouteController.js');
var auth = require("../middleware/auth.js");

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
router.post('/', auth, climbingRouteController.create);

module.exports = router;
