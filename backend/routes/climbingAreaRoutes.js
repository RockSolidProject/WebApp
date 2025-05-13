var express = require('express');
var router = express.Router();
var climbingAreaController = require('../controllers/climbingAreaController.js');

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
router.post('/', climbingAreaController.create);


module.exports = router;
