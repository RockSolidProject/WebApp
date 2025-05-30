var RouteWishListModel = require('../models/routeWishListModel.js')
var RouteClimbedModel = require('../models/routeClimbedModel.js')
var RouteCommentModel = require('../models/routeCommentModel.js')
var RouteRateModel = require('../models/routeRateModel.js')

/**
 * routeConnectionController.js
 *
 * @description :: Handles user route connections.
 */

module.exports = {
    getUsersWishlist: async function (req, res) {
        const userId = req.user.id

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

    getUsersClimbedRoutes: async function(req, res) {
        const userId = req.user.id
        try {
            const climbedRoutes = await RouteClimbedModel
                .find({postedBy: userId})
                .populate("postedBy")
                .populate("climbingRoute")
            return res.json(climbedRoutes)
        }
        catch (err) {
            return res.status(500).json({
                message: "Failed to get users climbed routes.",
                error: err
            })
        }
    },

    getRoutesComments: async function(req, res) {
        const routeId = req.params.routeId

        try {
            const comments = await RouteCommentModel
                .find({climbingRoute: routeId})
                .populate("postedBy")
                .populate("climbingRoute")
            return res.json(comments)
        }
        catch (err) {
            return res.status(500).json({
                message: "Error getting routes comments.",
                error: err
            })
        }
    },

    getRoutesRatings: async function(req, res) {
        const routeId = req.params.routeId
        try {
            const ratings = await RouteRateModel
                .find({climbingRoute: routeId})
                .populate("postedBy")
                .populate("climbingRoute")
            return res.json(ratings)
        }
        catch (err) {
            return res.status(500).json({
                message: "Error getting routes ratings.",
                error: err
            })
        }
    },

    toggleWishList: async function (req, res) {
        const routeId = req.params.routeId
        const userId = req.user.id
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
    },

    markClimbed: async function(req, res) {
        const routeId = req.params.routeId
        const userId = req.user.id

        try{            
            const current = await RouteClimbedModel.findOne({postedBy: userId, climbingRoute: routeId})
            if (current) {
                return res.status(400).json({message: "Already marked this route as climbed."})
            }

            const newClimbed = new RouteClimbedModel({
                climbingRoute: routeId,
                postedBy: userId,
                attempts: req.body.attempts,
                gradeOpinion: req.body.gradeOpinion
            })
            await newClimbed.save()

            return res.status(201).json({message: "Marked the route as climbed."})
        }
        catch (err) {
            return res.status(500).json({
                message: "Failed to mark routes as climbed.",
                error: err
            })
        }
    },

    commentRoute: async function(req, res) {
        const routeId = req.params.routeId
        const userId = req.user.id

        try {
            const comment = new RouteCommentModel({
                climbingRoute: routeId,
                postedBy: userId,
                content: req.body.content,
                image: req.body.image
            })

            const addedComment = await comment.save()
            return res.status(201).json(addedComment)
        }
        catch (err) {
            return res.status(500).json({
                message: "Adding comment failed",
                error: err
            })
        }
    },

    rateRoute: async function(req, res) {
        const routeId = req.params.routeId
        const userId = req.user.id

        try {
            const current = await RouteRateModel.findOne({postedBy: userId, climbingRoute: routeId})
            if (current) {
                current.rating = req.body.rating
                await current.save()
                return res.status(200).json(current)
            }
            const routeRate = new RouteRateModel({
                climbingRoute: routeId,
                postedBy: userId,
                rating: req.body.rating
            })
            await routeRate.save()
            return res.status(201).json(routeRate)
        }
        catch (err) {
            return res.status(500).json({
                message: "Rating route failed.",
                error: err
            })
        }
    }
}