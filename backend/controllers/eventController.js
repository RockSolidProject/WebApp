const EventModel = require('../models/eventModel.js');
const GroupModel = require('../models/groupModel.js');
const GroupMemberModel = require('../models/groupMemberModel.js');

module.exports = {

    // GET /events/:id
    show: async function (req, res) {
        try {
            const event = await EventModel.findOne({ _id: req.params.id })
                .populate("climbingAreas")
                .populate("climbingCenters")
                .populate("group");

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

    // GET /events
    list: async function (req, res) {
        try {
            const now = new Date();

            // Get groups the user belongs to
            const myGroups = await GroupMemberModel.find({ member: req.user.id });
            const myGroupIds = myGroups.map(gm => gm.group);

            // Public events are those with no group assigned (group: null)
            const publicEvents = await EventModel.find({
                date: { $gte: now },
                group: null
            }).sort({ date: 1 });

            // My events are events whose group is one of the user's groups
            const myEvents = await EventModel.find({
                date: { $gte: now },
                group: { $in: myGroupIds }
            }).sort({ date: 1 });

            return res.json({ publicEvents, myEvents });

        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting events.',
                error: err
            });
        }
    },

    // POST /events
    create: async function (req, res) {
        const group = req.body.group || null;
        const centers = req.body.climbingCenters || [];
        const areas = req.body.climbingAreas || [];
        const date = req.body.date ? new Date(req.body.date) : new Date();

        if (!group && centers.length === 0 && areas.length === 0) {
            return res.status(400).json({
                message: 'Event must have at least one center or area.',
                error: new Error('Invalid event data'),
            });
        }

        try {
            if (group) {
                const ownedGroup = await GroupModel.findOne({
                    _id: group,
                    owner: req.user.id
                });

                if (!ownedGroup) {
                    return res.status(400).json({
                        message: 'Cannot add a group that doesn\'t belong to you',
                        error: new Error('Unauthorized group assignment'),
                    });
                }
            }

            const event = new EventModel({
                climbingAreas: areas,
                climbingCenters: centers,
                group: group,
                name: req.body.name,
                description: req.body.description,
                date: date,
                photo: req.body.photo,
                owner: req.user.id,
            });

            const savedEvent = await event.save();
            return res.json(savedEvent);

        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating event.',
                error: err
            });
        }
    }

};
