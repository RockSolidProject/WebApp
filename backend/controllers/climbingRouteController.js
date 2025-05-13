var ClimbingrouteModel = require('../models/climbingRouteModel.js');

/**
 * climbingRouteController.js
 *
 * @description :: Server-side logic for managing climbingRoutes.
 */
module.exports = {

    /**
     * climbingRouteController.list()
     */
    list: async function (req, res) {
        try {
            const climbingRoutes = await ClimbingrouteModel
                .find()
                .populate("postedBy")
                .populate("climbingArea")
            return res.json(climbingRoutes);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing routes.',
                error: err
            });
        }
    },

    /**
     * climbingRouteController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const climbingRoute = await ClimbingrouteModel
                .findById(id)
                .populate("postedBy")
                .populate("climbingArea")
            if (!climbingRoute) {
                return res.status(404).json({
                    message: 'No such climbing route.'
                });
            }
            return res.json(climbingRoute);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing route.',
                error: err
            });
        }
    },

    /**
     * climbingRouteController.create()
     */
    create: async function (req, res) {
        var climbingRoute = new ClimbingrouteModel({
			name : req.body.name,
			length : req.body.length,
			type : req.body.type,
            climbingArea: req.body.climbingArea
        });

        try {
            const savedClimbingRoute = await climbingRoute.save()
            return res.status(201).json(savedClimbingRoute);
        }
        catch (err) {
            return res.status(500).json({
                    message: 'Error when creating climbingRoute',
                    error: err
            });
        }
    },
};
