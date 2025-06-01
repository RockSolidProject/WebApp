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
    show: async function (req, res) {
        try {
            const event = await EventModel.findOne({_id:req.params.id})
                .populate("climbingAreas")
                .populate("climbingCenters")
                .populate("groups");


            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            return res.json(event);
        } catch (err) {
            return res.status(500).json({
                message: "Error when fetching event.",
                error: err,
            });
        }
    },
    list: async function (req, res) {
        try {
            const now = new Date(); // current date and time
            const events = await EventModel.find({ date: { $gte: now } }); // events on or after now
            return res.json(events);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting events.',
                error: err
            });
        }
    },

    /**
     * eventController.s

    /**
     * eventController.create()
     */
    create: async function (req, res) {
        const groups = req.body.groups ? req.body.groups : [];
        const centers = req.body.climbingCenters ? req.body.climbingCenters : [];
        const areas = req.body.climbingAreas ? req.body.climbingAreas : [];
        const date = req.body.date ? new Date(req.body.date) : new Date();
        if (groups.length === 0 || (centers.length === 0 && areas.length === 0)) {
            return res.status(400).json({
                message: 'Event must have at least one group',
                error: new Error('cannot create an event and center'),
            })
        }
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
                date: date,
                photo: req.body.photo,
                user: req.user.id,
            });

            const savedEvent = await event.save();
            return res.json(savedEvent)

        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting event.',
                error: err
            })
        }
    },

};
