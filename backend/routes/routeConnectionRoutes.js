var express = require('express');
var router = express.Router();
var routeConnectionController = require('../controllers/routeConnectionController.js');
var auth = require("../middleware/auth.js");

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
router.post('/comment/:routeId', auth, routeConnectionController.commentRoute)

/*
 * POST
 */
router.post('/rating/:routeId', auth, routeConnectionController.rateRoute)

module.exports = router;