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

module.exports = router;