var express = require('express');
var router = express.Router();
var climbingCenterController = require('../controllers/climbingCenterController.js');

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
router.post('/', climbingCenterController.create);

/*
 * PUT
 */
router.put('/:id', climbingCenterController.update);

/*
 * DELETE
 */
router.delete('/:id', climbingCenterController.remove);

module.exports = router;
