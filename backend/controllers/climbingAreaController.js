var ClimbingareaModel = require('../models/climbingAreaModel.js');
const haversine = require('haversine-distance');
const insidePolygon = require('point-in-polygon');

module.exports = {

    /**
     * climbingAreaController.list()
     */
    listSearch: async function (req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const pattern = req.query.pattern || "";
            const nameFilter = { name: { $regex: `^${pattern}`, $options: "i" } };

            const climbingAreas = await ClimbingareaModel
                .find(nameFilter)
                .limit(limit)
                .populate("postedBy")
                .populate({
                    path: "routes",
                    populate: { path: "postedBy" }
                });

            return res.json(climbingAreas);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing areas.',
                error: err.message || err
            });
        }
    },
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
    getInPolygon: async function(req,res) {
        const polygon = req.body;
        if (!polygon || polygon.length < 3) {
            return res.status(400).json({message: "Requires polygon with at least 3 points."})
        }
        const polygonPoints = polygon.map(([lat, lng]) => [lng, lat]);
        try {
            const climbingAreas = await ClimbingareaModel.find()
                .populate("postedBy")
                .populate({
                    path: "routes",
                    populate: { path: "postedBy" }
                })
            const areasInsidePolygon = climbingAreas.filter(area => {
                const point = [area.longitude, area.latitude];
                return insidePolygon(point, polygonPoints);
            });
            return res.json(areasInsidePolygon);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing areas.',
                error: err.message || err
            });
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
