const climbingCenterModel = require("../models/climbingCenterModel");

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

    /**
     * climbingCenterController.show()
     */
    getByProximity: async function (req, res) {
        var latitude = req.params.latitude;
        var longitude = req.params.longitude;
        try {
            const climbingCenters = await climbingCenterModel
                .find()
                .populate("owner");
            climbingCenters.sort((a,b) => {
                    var distA = Math.hypot(a.latitude - latitude, a.longitude - longitude);
                    var distB =Math.hypot(b.latitude - latitude, b.longitude - longitude)
                    return  distA - distB ;
                })
            return res.json(climbingCenters);
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
            hasSprayWall : req.body.hasSprayWall
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
