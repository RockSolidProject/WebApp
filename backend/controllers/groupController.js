var GroupModel = require('../models/groupModel.js');
var GroupMemberModel = require('../models/groupMemberModel.js');

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
    show: async function (req, res) {

        var id = req.params.id;
        try {
            var group = await GroupModel.findOne({_id: id})
            return res.json(group)
        } catch(err) {
            return res.status(500).json({
                error: err,
                message: "failed to show groups"
            })
        }

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
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating group',
                error: err
            })
        }

    },

    join: async function (req, res) {
        try {
            var groupId = req.body.groupId;
            var group = await GroupModel.findOne({_id: groupId, isPrivate: false});
            if (!group) {
                return res.status(400).json({
                    message: 'Cannot join a private group or a nonexistent one',
                    error: new Error('')
                });
            }
            var groupMember = await GroupMemberModel.findOne({group: groupId, member: req.user.id})
            if (!groupMember) {
                groupMember = new GroupMemberModel({
                    member: req.user.id,
                    group: groupId,
                })
                return res.json(groupMember);
            } else {
                return res.status(400).json({
                    message: 'Already joined the group',
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: 'Error when joining group',
                error: err
            })
        }
    },
    addMember: async function (req, res) {
        try {
            var groupId = req.body.group;
            var ownerId = req.user.id;
            var memberId = req.body.member;
            var group = await GroupModel.findOne({_id: groupId, owner: ownerId});
            if (!group) {
                return res.status(400).json({
                    message: 'Cannot add a member to group that you don\'t own or a nonexistent one',
                    error: new Error('')
                });
            }
            var groupMember = await GroupMemberModel.findOne({group: groupId, member: memberId})
            if (!groupMember) {
                groupMember = new GroupMemberModel({
                    member: memberId,
                    group: groupId,
                })
                return res.json(groupMember);
            } else {
                return res.status(400).json({
                    message: 'Already joined the group',
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: 'Error when joining group',
                error: err
            })
        }
    }
};
