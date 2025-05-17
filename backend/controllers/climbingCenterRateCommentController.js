var ClimbingcenterrateModel = require('../models/climbingCenterRateModel.js');

/**
 * climbingCenterRateCommentController.js
 *
 * @description :: Server-side logic for managing climbingCenterRates.
 */
module.exports = {

    /**
     * climbingCenterRateController.list()
     */
    list: function (req, res) {
        ClimbingcenterrateModel.find(function (err, climbingCenterRates) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenterRate.',
                    error: err
                });
            }

            return res.json(climbingCenterRates);
        });
    },

    /**
     * climbingCenterRateController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ClimbingcenterrateModel.findOne({_id: id}, function (err, climbingCenterRate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenterRate.',
                    error: err
                });
            }

            if (!climbingCenterRate) {
                return res.status(404).json({
                    message: 'No such climbingCenterRate'
                });
            }

            return res.json(climbingCenterRate);
        });
    },

    /**
     * climbingCenterRateController.create()
     */
    create: function (req, res) {
        var climbingCenterRate = new ClimbingcenterrateModel({
			climbingCenter : req.body.climbingCenter,
			postedBy : req.body.postedBy,
			rating : req.body.rating,
			dateTime : req.body.dateTime
        });

        climbingCenterRate.save(function (err, climbingCenterRate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating climbingCenterRate',
                    error: err
                });
            }

            return res.status(201).json(climbingCenterRate);
        });
    },

    /**
     * climbingCenterRateController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ClimbingcenterrateModel.findOne({_id: id}, function (err, climbingCenterRate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting climbingCenterRate',
                    error: err
                });
            }

            if (!climbingCenterRate) {
                return res.status(404).json({
                    message: 'No such climbingCenterRate'
                });
            }

            climbingCenterRate.climbingCenter = req.body.climbingCenter ? req.body.climbingCenter : climbingCenterRate.climbingCenter;
			climbingCenterRate.postedBy = req.body.postedBy ? req.body.postedBy : climbingCenterRate.postedBy;
			climbingCenterRate.rating = req.body.rating ? req.body.rating : climbingCenterRate.rating;
			climbingCenterRate.dateTime = req.body.dateTime ? req.body.dateTime : climbingCenterRate.dateTime;
			
            climbingCenterRate.save(function (err, climbingCenterRate) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating climbingCenterRate.',
                        error: err
                    });
                }

                return res.json(climbingCenterRate);
            });
        });
    },

    /**
     * climbingCenterRateController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ClimbingcenterrateModel.findByIdAndRemove(id, function (err, climbingCenterRate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the climbingCenterRate.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
