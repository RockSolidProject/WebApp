var ClimbingareaModel = require('../models/climbingAreaModel.js');
const haversine = require('haversine-distance');

module.exports = {

    /**
     * climbingAreaController.list()
     */
    list: async function (req, res) {
        try {
            const climbingAreas = await ClimbingareaModel
                .find()
                .populate("postedBy")
                .populate({
                    path: "routes",
                    populate: { path: "postedBy" }
                })
            return res.json(climbingAreas)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing areas.',
                error: err
            })
        }
    },
    getByProximity: async function (req, res) {
        try {
            var latitude = parseFloat(req.body.latitude);
            var longitude = parseFloat(req.body.longitude);
            var maxDistance = parseFloat(req.body.distance);

            if (isNaN(latitude) || isNaN(longitude) || isNaN(maxDistance)) {
                return res.status(400).json({ 
                    message: "Invalid coordinates or distance" 
                });
            }
            const userLocation = { lat: latitude, lon: longitude };
            const climbingAreas = await ClimbingareaModel
                .find()
                .populate("postedBy")
                .populate({
                    path: "routes",
                    populate: { path: "postedBy" }
                })
            const nerbyAreas = climbingAreas.filter(area => {
                const areaLocation = { lat: area.latitude, lon: area.longitude}
                const distance = haversine(userLocation, areaLocation) / 1000
                return distance <= maxDistance
            })
            return res.json(nerbyAreas)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing areas.',
                error: err
            })
        }
    },

    /**
     * climbingAreaController.show()
     */
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const climbingArea = await ClimbingareaModel
                .findById(id)
                .populate("postedBy")
            if (!climbingArea) {
                return res.status(404).json({
                    message: 'No such climbingArea'
                });
            }
            return res.json(climbingArea)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingArea.',
                error: err
            });
        }
    },

    /**
     * climbingAreaController.create()
     */
    create: async function (req, res) {
        var climbingArea = new ClimbingareaModel({
			name : req.body.name,
			latitude : req.body.latitude,
			longitude : req.body.longitude,
            postedBy : req.user.id
        });
        try {
            const savedClimbingArea = await climbingArea.save();
            return res.status(201).json(savedClimbingArea);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when creating climbingArea',
                error: err
            });
        }
    }
};
