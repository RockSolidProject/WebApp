var express = require('express');
var router = express.Router();
var routeConnectionController = require('../controllers/routeConnectionController.js');

/*
 * GET
 */
router.get('/wishlist', routeConnectionController.getUsersWishlist)

/*
 * POST
 */
router.post('/wishlist/:routeId', routeConnectionController.toggleWishList)


module.exports = router;