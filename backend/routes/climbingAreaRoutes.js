var express = require('express');
var router = express.Router();
var climbingAreaController = require('../controllers/climbingAreaController.js');
var auth = require("../middleware/auth.js");

/*
 * GET
 */
router.get('/', climbingAreaController.list);

/*
 * GET
 */
router.get('/:id', climbingAreaController.show);

/*
 * POST
 */
router.post('/', auth, climbingAreaController.create);
router.post('/byProximity', climbingAreaController.getByProximity);


module.exports = router;
