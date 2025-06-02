const climbingCenterModel = require("../models/climbingCenterModel");
const haversine = require('haversine-distance');
const insidePolygon = require('point-in-polygon');

module.exports = {

    /**
     * climbingCenterController.list()
     */
    list: async function (req, res) {
        try {
            const climbingCenters = await climbingCenterModel
                .find()
                .populate("owner");
            return res.json(climbingCenters);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing centers.',
                error: err.message || err
            });
        }
    },

    listSearch: async function (req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const pattern = req.query.pattern || "";
            const nameFilter = { name: { $regex: `^${pattern}`, $options: "i" } };

            const climbingCenters = await climbingCenterModel
                .find(nameFilter)       // Apply regex filter here
                .limit(limit)
                .populate("owner");

            return res.json(climbingCenters);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing centers.',
                error: err.message || err
            });
        }
    },

    /**
     * climbingCenterController.show()
     */
    getByProximity: async function (req, res) {
        try {
            const latitude = parseFloat(req.body.latitude);
            const longitude = parseFloat(req.body.longitude);
            const maxDistance = parseFloat(req.body.distance) * 1000;

            if (isNaN(latitude) || isNaN(longitude) || isNaN(maxDistance)) {
                return res.status(400).json({
                    message: "Invalid coordinates or distance"
                });
            }

            const userLocation = { latitude, longitude };
            const climbingCenters = await climbingCenterModel.find().populate("owner");

            const nearbyCenters = climbingCenters.filter(center => {
                const centerLocation = { latitude: center.latitude, longitude: center.longitude };
                const distance = haversine(userLocation, centerLocation);
                return distance <= maxDistance;
            });

            return res.json(nearbyCenters);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing centers.',
                error: err.message || err
            });
        }
    },
    getInPolygon: async function (req, res) {
        const polygon = req.body;
        if (!polygon || polygon.length < 3) {
            return res.status(400).json({message: "Requires polygon with at least 3 points."})
        }

        const polygonPoints = polygon.map(([lat, lng]) => [lng, lat]);

        try {
            const climbingCenters = await climbingCenterModel.find().populate("owner");

            const centersInsidePolygon = climbingCenters.filter(center => {
                const point = [center.longitude, center.latitude];
                return insidePolygon(point, polygonPoints);
            });
            return res.json(centersInsidePolygon);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbing centers.',
                error: err.message || err
            });
        }
    },
    show: async function (req, res) {
        var id = req.params.id;

        try {
            const climbingCenter = await climbingCenterModel
                .findById(id)
                .populate("owner")
            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }
            return res.json(climbingCenter)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingCenter.',
                error: err
            });
        }
    },

    /**
     * climbingCenterController.create()
     */
    create: async function (req, res) {
        var climbingCenter = new climbingCenterModel({
            name : req.body.name,
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            owner : req.body.owner,
            hasBoulders : req.body.hasBoulders,
            hasRoutes : req.body.hasRoutes,
            hasMoonboard : req.body.hasMoonboard,
            hasSprayWall : req.body.hasSprayWall,
            hasKilter : req.body.hasKilter
        });
        try {
            const savedclimbingCenter = await climbingCenter.save();
            return res.status(201).json(savedclimbingCenter);
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when creating climbingCenter',
                error: err
            });
        }
    },

    listMoonboard: async function (req, res) {
        try {
            const climbingCenter = await climbingCenterModel
                .find({ hasMoonboard: true })
                .populate("owner")
            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }
            return res.json(climbingCenter)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingCenter.',
                error: err
            });
        }
    },

    listBoulders: async function (req, res) {
        try {
            const climbingCenter = await climbingCenterModel
                .find({ hasBoulders: true })
                .populate("owner")
            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }
            return res.json(climbingCenter)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingCenter.',
                error: err
            });
        }
    },

    listRoutes: async function (req, res) {
        try {
            const climbingCenter = await climbingCenterModel
                .find({ hasRoutes: true })
                .populate("owner")
            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }
            return res.json(climbingCenter)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingCenter.',
                error: err
            });
        }
    },

    listSprayWall: async function (req, res) {
        try {
            const climbingCenter = await climbingCenterModel
                .find({hasSprayWall: true})
                .populate("owner")
            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }
            return res.json(climbingCenter)
        }
        catch (err) {
            return res.status(500).json({
                message: 'Error when getting climbingCenter.',
                error: err
            });
        }
    },
};
