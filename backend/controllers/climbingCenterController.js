var ClimbingcenterModel = require('../models/climbingCenterModel.js');

module.exports = {

    /**
     * climbingCenterController.list()
     */
    list: function (req, res) {
        ClimbingcenterModel.find(function (err, climbingCenters) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenter.',
                    error: err
                });
            }

            return res.json(climbingCenters);
        });
    },

    /**
     * climbingCenterController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClimbingcenterModel.findOne({_id: id}, function (err, climbingCenter) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenter.',
                    error: err
                });
            }

            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }

            return res.json(climbingCenter);
        });
    },

    /**
     * climbingCenterController.create()
     */
    create: function (req, res) {
        var climbingCenter = new ClimbingcenterModel({
			name : req.body.name,
			latitude : req.body.latitude,
			longitude : req.body.longitude,
			owner : req.body.owner,
			hasBoulders : req.body.hasBoulders,
			hasRoutes : req.body.hasRoutes,
			hasMoonboard : req.body.hasMoonboard,
			hasSprayWall : req.body.hasSprayWall
        });

        climbingCenter.save(function (err, climbingCenter) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating climbingCenter',
                    error: err
                });
            }

            return res.status(201).json(climbingCenter);
        });
    },

    /**
     * climbingCenterController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClimbingcenterModel.findOne({_id: id}, function (err, climbingCenter) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenter',
                    error: err
                });
            }

            if (!climbingCenter) {
                return res.status(404).json({
                    message: 'No such climbingCenter'
                });
            }

            climbingCenter.name = req.body.name ? req.body.name : climbingCenter.name;
			climbingCenter.latitude = req.body.latitude ? req.body.latitude : climbingCenter.latitude;
			climbingCenter.longitude = req.body.longitude ? req.body.longitude : climbingCenter.longitude;
			climbingCenter.owner = req.body.owner ? req.body.owner : climbingCenter.owner;
			climbingCenter.hasBoulders = req.body.hasBoulders ? req.body.hasBoulders : climbingCenter.hasBoulders;
			climbingCenter.hasRoutes = req.body.hasRoutes ? req.body.hasRoutes : climbingCenter.hasRoutes;
			climbingCenter.hasMoonboard = req.body.hasMoonboard ? req.body.hasMoonboard : climbingCenter.hasMoonboard;
			climbingCenter.hasSprayWall = req.body.hasSprayWall ? req.body.hasSprayWall : climbingCenter.hasSprayWall;
			
            climbingCenter.save(function (err, climbingCenter) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating climbingCenter.',
                        error: err
                    });
                }

                return res.json(climbingCenter);
            });
        });
    },

    /**
     * climbingCenterController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClimbingcenterModel.findByIdAndRemove(id, function (err, climbingCenter) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the climbingCenter.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
