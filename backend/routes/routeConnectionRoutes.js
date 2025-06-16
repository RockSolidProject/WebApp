var express = require('express');
var router = express.Router();
var routeConnectionController = require('../controllers/routeConnectionController.js');
var auth = require("../middleware/auth.js");
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
router.get('/wishlist', auth, routeConnectionController.getUsersWishlist)

/*
 * GET
 */
router.get('/climbed', auth, routeConnectionController.getUsersClimbedRoutes)
router.get('/averageGrade/:routeId', routeConnectionController.getAverageGrade)

/*
 * GET
 */
router.get('/comment/:routeId', routeConnectionController.getRoutesComments)

/*
 * GET
 */
router.get('/gradesOverTime/:routeId', routeConnectionController.getGradesOverTime);

/*
 * GET
 */
router.get('/rating/:routeId', routeConnectionController.getRoutesRatings)

/*
 * POST
 */
router.post('/wishlist/:routeId', auth, routeConnectionController.toggleWishList)

/*
 * POST
 */
router.post('/climbed/:routeId', auth, routeConnectionController.markClimbed)

/*
 * POST
 */
router.post('/comment/:routeId', auth, upload.single('image'), routeConnectionController.commentRoute)

/*
 * POST
 */
router.post('/rating/:routeId', auth, routeConnectionController.rateRoute)

module.exports = router;