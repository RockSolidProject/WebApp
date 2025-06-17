var ClimbingCenterRateModel = require('../models/climbingCenterRateModel.js');
var ClimbingCenterCommentModel = require('../models/climbingCenterCommentModel.js');
var ClimbingCenterModel = require('../models/climbingCenterModel.js');
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

    getClimbingCenterAverageRating: async function(req, res) {
        const centerId = req.params.centerId
        try {
            const ratings = await ClimbingCenterRateModel
                .find({climbingCenter: centerId})
            if (ratings.length === 0) {
                return res.status(200).json({
                    message: "Ni še ocen.",
                    averageRating: 0
                })
            }
            const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
            const average = sum / ratings.length
            return res.status(200).json({
                averageRating: average
            })
        }
        catch (err) {
            return res.status(500).json({
                message: "Error getting center average rating.",
                error: err
            })
        }
    },


    commentCenter: async function(req, res) {
        const centerId = req.params.centerId;
        const userId = req.user.id;

        try {
            if (!req.body.content) {
                return res.status(400).json({ message: "Comment content is required." });
            }

            const imagePath = req.file ? `/public/commentImages/${req.file.filename}` : null;

            const comment = new ClimbingCenterCommentModel({
                climbingCenter: centerId,
                postedBy: userId,
                content: req.body.content,
                image: imagePath
            });

            const addedComment = await comment.save();
            return res.status(201).json(addedComment);
        } catch (err) {
            console.error('Error in commentCenter:', err.stack || err.message || err);
            return res.status(500).json({
                message: "Adding comment failed",
                error: err.message || err
            });
        }
    },

    rateCenter: async function(req, res) {
        const centerId = req.params.centerId;
        const userId = req.user.id;

        if (req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });
        }

        try {
            const current = await ClimbingCenterRateModel.findOne({ postedBy: userId, climbingCenter: centerId });
            if (current) {
                current.rating = req.body.rating;
                await current.save();
            } else {
                const centerRate = new ClimbingCenterRateModel({
                    climbingCenter: centerId,
                    postedBy: userId,
                    rating: req.body.rating
                });
                await centerRate.save();
            }

            const ratings = await ClimbingCenterRateModel.find({ climbingCenter: centerId });
            const sum = ratings.reduce((res, rating) => res + rating.rating, 0);
            const average = sum / ratings.length;

            await ClimbingCenterModel.findByIdAndUpdate(centerId, { rating: average });

            return res.status(200).json({
                message: "Rating updated successfully.",
                averageRating: average
            });
        } catch (err) {
            return res.status(500).json({
                message: "Rating center failed.",
                error: err.message || err
            });
        }
    }
};