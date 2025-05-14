var express = require('express');
var router = express.Router();
var routeConnectionController = require('../controllers/routeConnectionController.js');

/*
 * GET
 */
router.get('/wishlist', routeConnectionController.getUsersWishlist)

/*
 * GET
 */
router.get('/climbed', routeConnectionController.getUsersClimbedRoutes)

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
router.post('/wishlist/:routeId', routeConnectionController.toggleWishList)

/*
 * POST
 */
router.post('/climbed/:routeId', routeConnectionController.markClimbed)

/*
 * POST
 */
router.post('/comment/:routeId', routeConnectionController.commentRoute)

/*
 * POST
 */
router.post('/rating/:routeId', routeConnectionController.rateRoute)

module.exports = router;