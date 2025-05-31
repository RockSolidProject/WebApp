var RouteWishListModel = require('../models/routeWishListModel.js')
var RouteClimbedModel = require('../models/routeClimbedModel.js')
var RouteCommentModel = require('../models/routeCommentModel.js')
var RouteRateModel = require('../models/routeRateModel.js')
/**
 * routeConnectionController.js
 *
 * @description :: Handles user route connections.
 */

const ropeGrades = [
    "3", "3+", "4a", "4b", "4c",
    "5a", "5b", "5c",
    "6a", "6a+", "6b", "6b+", "6c", "6c+",
    "7a", "7a+", "7b", "7b+", "7c", "7c+",
    "8a", "8a+", "8b", "8b+", "8c", "8c+",
    "9a", "9a+", "9b", "9b+", "9c", "9c+"
];
const boulderGrades = [
    "3", "3+", "4", "4+", "5", "5+",
    "6A", "6A+", "6B", "6B+", "6C", "6C+",
    "7A", "7A+", "7B", "7B+", "7C", "7C+",
    "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
];
const urbanGrades = [
    "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+",
    "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+"
];

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

    getAverageGrade: async function(req, res) {
        const routeId = req.params.routeId
        try {
            const rates = await RouteClimbedModel.find({ climbingRoute: routeId }).populate("climbingRoute");
            if (!rates.length) {
                return res.json({ average: null });
            }
            const routeType = rates[0].climbingRoute.type;
            let gradeList = [];
            if (routeType === "boulder") gradeList = boulderGrades;
            else if (routeType === "lead") gradeList = ropeGrades;
            else if (routeType === "urban") gradeList = urbanGrades;

            const gradeIndexes = rates
                .map(grade => gradeList.indexOf(grade.gradeOpinion))
                .filter(index => index !== -1);

            if (!gradeIndexes.length) {
                return res.json({ average: null });
            }

            const avgIndex = gradeIndexes.reduce((a, b) => a + b, 0) / gradeIndexes.length;
            const avgGrade = gradeList[Math.round(avgIndex)];

            return res.json({ average: avgGrade });
        } catch (err) {
            return res.status(500).json({
                message: "Error getting route average grade.",
                error: err
            })
        }

    },

    // getAverageAttempts: async function(req, res) {
    //     const routeId = req.params.routeId
    //     try{
    //
    //     }
    // }

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

        if(req.body.gradeOpinion === "rope" && !ropeGrades.includes(req.body.gradeOpinion)) {
            return res.status(400).json({message: "Invalid rope grade."})
        }
        if(req.body.gradeOpinion === "boulder" && !boulderGrades.includes(req.body.gradeOpinion)) {
            return res.status(400).json({message: "Invalid boulder grade."})
        }
        if(req.body.gradeOpinion === "urban" && !urbanGrades.includes(req.body.gradeOpinion)) {
            return res.status(400).json({message: "Invalid urban grade."})
        }
        if(req.body.gradeOpinion === "rope" && req.body.attempts < 1) {}
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
            await addedComment.populate('postedBy');
            return res.status(201).json(addedComment);
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
    },
    getGradesOverTime: async function(req, res) {
        const routeId = req.params.routeId;
        try {
            const rates = await RouteClimbedModel.find({ climbingRoute: routeId }).populate("climbingRoute");
            if (!rates.length) return res.json([]);

            const routeType = rates[0].climbingRoute.type;
            let gradeList = [];
            if (routeType === "boulder") gradeList = boulderGrades;
            else if (routeType === "lead") gradeList = ropeGrades;
            else if (routeType === "urban") gradeList = urbanGrades;

            const grouped = {};
            rates.forEach(r => {
                const period = r._id.getTimestamp ? r._id.getTimestamp().toISOString().slice(0, 7)
                    : (r.dateTime ? r.dateTime.toISOString().slice(0, 7) : "unknown");
                if (!grouped[period]) grouped[period] = [];
                const idx = gradeList.indexOf(r.gradeOpinion);
                if (idx !== -1) grouped[period].push(idx);
            });

            const result = Object.entries(grouped).map(([period, idxs]) => ({
                period,
                avgGradeIndex: idxs.reduce((a, b) => a + b, 0) / idxs.length
            }));

            res.json(result);
        } catch (err) {
            res.status(500).json({ message: "Error getting grades over time.", error: err });
        }
    }
}