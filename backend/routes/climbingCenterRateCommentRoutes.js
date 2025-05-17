var express = require('express');
var router = express.Router();
var climbingCenterRateController = require('../controllers/climbingCenterRateCommentController.js');

/*
 * GET
 */
router.get('/', climbingCenterRateController.list);

/*
 * GET
 */
router.get('/:id', climbingCenterRateController.show);

/*
 * POST
 */
router.post('/', climbingCenterRateController.create);

/*
 * PUT
 */
router.put('/:id', climbingCenterRateController.update);

/*
 * DELETE
 */
router.delete('/:id', climbingCenterRateController.remove);

module.exports = router;
