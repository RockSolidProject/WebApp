var express = require('express');
var router = express.Router();
var climbingCenterController = require('../controllers/climbingCenterController.js');
const climbingAreaController = require("../controllers/climbingCenterController");
const auth = require("../middleware/auth");

/*
 * GET
 */
router.get('/', climbingCenterController.list);

/*
 * GET
 */
router.get('/:id', climbingCenterController.show);

/*
 * POST
 */
router.post('/', auth, climbingCenterController.create);

module.exports = router;
