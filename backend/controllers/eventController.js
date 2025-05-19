var EventModel = require('../models/eventModel.js');
var GroupModel = require('../models/groupModel.js');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {

    /**
     * eventController.list()
     */
    list: async function (req, res) { // TODO
        try {
            var events = await EventModel.find();
            return res.json(events);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting event.',
                error: err
            })
        }

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
    create: async function (req, res) { // TODO
        var groups = req.body.groups ? req.body.groups : [];
        var centers = req.body.climbingCenters ? req.body.climbingCenters : [];
        var areas = req.body.climbingAreas ? req.body.climbingAreas:[];
        /*if (groups.length === 0 || (centers.length === 0 && areas.length === 0)) {
            return res.status(400).json({
                message: 'Event must have at least one group',
                error: new Error('cannot create an event and center'),
            })
        }*/
        try {
            const ownedGroups = await GroupModel.find({owner: req.user.id, _id: {$in: groups}});

            if (groups.length !== ownedGroups.length) {
                return res.status(400).json({
                    message: 'Cannot add a group that doesn\'t belong to you',
                    error: new Error('Cannot create event')
                })
            }
            var event = new EventModel({
                climbingAreas: areas,
                climbingCenters: centers,
                groups: groups,
                name: req.body.name,
                description: req.body.description,
                date: Date.now(),
                photo: req.body.photo,
                user: req.user.id,
            });

            var savedEvent = await event.save()
            return res.json(savedEvent)

        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting event.',
                error: err
            })
        }
    },

    /**
     * eventController.update()
     */

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
