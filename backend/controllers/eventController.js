var EventModel = require('../models/eventModel.js');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {

    /**
     * eventController.list()
     */
    list: function (req, res) { // TODO
        EventModel.find(function (err, events) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting event.',
                    error: err
                });
            }

            return res.json(events);
        });
    },

    /**
     * eventController.show()
     */
    show: function (req, res) { // TODO
        var id = req.params.id;

        EventModel.findOne({_id: id}, function (err, event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting event.',
                    error: err
                });
            }

            if (!event) {
                return res.status(404).json({
                    message: 'No such event'
                });
            }

            return res.json(event);
        });
    },

    /**
     * eventController.create()
     */
    create: function (req, res) { // TODO
        var event = new EventModel({
			climbingAreas : req.body.climbingAreas,
			climbingCenters : req.body.climbingCenters,
			groups : req.body.groups,
			name : req.body.name,
			description : req.body.description,
			date : req.body.date,
			photo : req.body.photo
        });

        event.save(function (err, event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating event',
                    error: err
                });
            }

            return res.status(201).json(event);
        });
    },

    /**
     * eventController.update()
     */
    update: function (req, res) { // TODO
        var id = req.params.id;

        EventModel.findOne({_id: id}, function (err, event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting event',
                    error: err
                });
            }

            if (!event) {
                return res.status(404).json({
                    message: 'No such event'
                });
            }

            event.climbingAreas = req.body.climbingAreas ? req.body.climbingAreas : event.climbingAreas;
			event.climbingCenters = req.body.climbingCenters ? req.body.climbingCenters : event.climbingCenters;
			event.groups = req.body.groups ? req.body.groups : event.groups;
			event.name = req.body.name ? req.body.name : event.name;
			event.description = req.body.description ? req.body.description : event.description;
			event.date = req.body.date ? req.body.date : event.date;
			event.photo = req.body.photo ? req.body.photo : event.photo;
			
            event.save(function (err, event) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating event.',
                        error: err
                    });
                }

                return res.json(event);
            });
        });
    },

    /**
     * eventController.remove()
     */
    remove: function (req, res) { // TODO
        var id = req.params.id;

        EventModel.findByIdAndRemove(id, function (err, event) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the event.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }

};
