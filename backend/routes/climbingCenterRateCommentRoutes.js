var express = require('express');
var router = express.Router();
var climbingCenterRateCommentController = require('../controllers/climbingCenterRateCommentController.js');
const auth = require("../middleware/auth");
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/commentImages'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
/*
 * GET
 */
router.get('/comment/:centerId', climbingCenterRateCommentController.getClimbingCenterComments);
router.get('/rating/:centerId', climbingCenterRateCommentController.getClimbingCenterRatings);
router.get('/average/:centerId', climbingCenterRateCommentController.getClimbingCenterRatings);
/*
 * POST
 */
router.post('/comment/:centerId', auth, upload.single('image'), climbingCenterRateCommentController.commentCenter);
router.post('/rating/:centerId', auth, climbingCenterRateCommentController.rateCenter);

module.exports = router;
