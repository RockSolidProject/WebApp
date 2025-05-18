var express = require('express');
var router = express.Router();
var climbingCenterRateCommentController = require('../controllers/climbingCenterRateCommentController.js');
const auth = require("../middleware/auth");

/*
 * GET
 */
router.get('/comment/:centerId', climbingCenterRateCommentController.getClimbingCenterComments);
router.get('/rating/:centerId', climbingCenterRateCommentController.getClimbingCenterRatings);
router.get('/average/:centerId', climbingCenterRateCommentController.getClimbingCenterAverageRating);
/*
 * POST
 */
router.post('/comment/:centerId', auth, climbingCenterRateCommentController.commentCenter);
router.post('/rating/:centerId', auth, climbingCenterRateCommentController.rateCenter);

module.exports = router;
