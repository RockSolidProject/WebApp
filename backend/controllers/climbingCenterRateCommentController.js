var ClimbingCenterRateModel = require('../models/climbingCenterRateModel.js');
var ClimbingCenterCommentModel = require('../models/climbingCenterCommentModel.js');

module.exports = {

    getClimbingCenterComments: async function(req, res) {
        const centerId = req.params.centerId
        try {
            const comments = await ClimbingCenterCommentModel
                .find({climbingCenter: centerId})
                .populate("postedBy")
                .populate("climbingCenter")
            return res.json(comments)
        }
        catch (err) {
            return res.status(500).json({
                message: "Error getting center comments.",
                error: err
            })
        }
    },

    getClimbingCenterRatings: async function(req, res) {
        const centerId = req.params.centerId
        try {
            const ratings = await ClimbingCenterRateModel
                .find({climbingCenter: centerId})
                .populate("postedBy")
                .populate("climbingCenter")
            return res.json(ratings)
        }
        catch (err) {
            return res.status(500).json({
                message: "Error getting center ratings.",
                error: err
            })
        }
    },


    commentCenter: async function(req, res) {
        const centerId = req.params.centerId
        const userId = req.user.id

        try {
            const comment = new ClimbingCenterCommentModel({
                climbingCenter: centerId,
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

    rateCenter: async function(req, res) {
        const centerId = req.params.centerId
        const userId = req.user.id

        try {
            const current = await ClimbingCenterRateModel.findOne({postedBy: userId, climbingCenter: centerId})
            if (current) {
                current.rating = req.body.rating
                await current.save()
                return res.status(200).json(current)
            }
            const centerRate = new ClimbingCenterRateModel({
                climbingCenter: centerId,
                postedBy: userId,
                rating: req.body.rating
            })
            await centerRate.save()
            return res.status(201).json(centerRating)
        }
        catch (err) {
            return res.status(500).json({
                message: "Rating center failed.",
                error: err
            })
        }
    }
};
