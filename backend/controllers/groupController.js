var GroupModel = require('../models/groupModel.js');

/**
 * groupController.js
 *
 * @description :: Server-side logic for managing groups.
 */
module.exports = {

    /**
     * groupController.list()
     */
    list: async function (req, res) {
        try {
            const groups = await GroupModel.find()
            return res.json(groups)
        } catch (err) {
            return res.status(500).json({
                error: err,
                message: "failed to list groups"
            })
        }
    },

    /**
     * groupController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GroupModel.findOne({_id: id}, function (err, group) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting group.',
                    error: err
                });
            }

            if (!group) {
                return res.status(404).json({
                    message: 'No such group'
                });
            }

            return res.json(group);
        });
    },

    /**
     * groupController.create()
     */
    create: async function (req, res) {
        var group = new GroupModel({//TODO
            name: req.body.name,
            isPrivate: req.body.isPrivate,
            owner: req.user.id
        });
        try {
            var savedGroup = await group.save();
            return res.json(savedGroup);
        }catch(err) {
            return res.status(500).json({
                message: 'Error when creating group',
                error: err
            })
        }

    },

    /**
     * groupController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        GroupModel.findOne({_id: id}, function (err, group) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting group',
                    error: err
                });
            }

            if (!group) {
                return res.status(404).json({
                    message: 'No such group'
                });
            }

            group.name = req.body.name ? req.body.name : group.name;
            group.isPrivate = req.body.isPrivate ? req.body.isPrivate : group.isPrivate;
            group.owner = req.body.owner ? req.body.owner : group.owner;

            group.save(function (err, group) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating group.',
                        error: err
                    });
                }

                return res.json(group);
            });
        });
    },

    /**
     * groupController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        GroupModel.findByIdAndRemove(id, function (err, group) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the group.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
