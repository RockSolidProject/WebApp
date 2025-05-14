var RouteWishListModel = require('../models/routeWishListModel.js')

/**
 * routeConnectionController.js
 *
 * @description :: Handles user route connections.
 */

module.exports = {
    getUsersWishlist: async function (req, res) {
        //TODO get user ID 
        const userId = "000000000000000000000000"

        try {
            const wishlist = await RouteWishListModel
                .find({postedBy: userId})
                .populate("postedBy")
                .populate("climbingRoute")
            return res.json(wishlist)
        }
        catch (err) {
            return res.status(500).json({
                message: "Error while getting users wish list.",
                error: err
            })
        }
    },

    toggleWishList: async function (req, res) {
        const routeId = req.params.routeId
        //TODO get user ID 
        const userId = "000000000000000000000000"
        try {
            const current = await RouteWishListModel.findOne({postedBy: userId, climbingRoute: routeId})
            if (current) {
                await RouteWishListModel.findByIdAndDelete(current._id)
                return res.status(201).json({message: "Removed this route from wish list."})
            }
            const newWishlist = new RouteWishListModel({
                climbingRoute: routeId,
                postedBy: userId
            })
            await newWishlist.save()
            return res.status(201).json({message: "Added new route to wishlist"})

        }
        catch (err) {
            res.status(500).json({
                message: "Error updating wishlist",
                error: err
            })
        }
    }
}