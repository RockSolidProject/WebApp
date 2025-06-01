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
    listSearch: async function (req, res) {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const pattern = req.query.pattern || "";
            console.log("here");

            // Filter by name prefix if pattern provided
            const nameFilter = { name: { $regex: `^${pattern}`, $options: "i" } };

            // Get owned groups matching pattern
            const ownedGroups = await GroupModel.find({
                owner: userId,
                ...nameFilter,
            });

            /*// Get groups where the user is a member, populate the group
            const memberships = await GroupMemberModel.find({ member: userId }).populate({
                path: "group",
                match: nameFilter,
            });

            const memberGroups = memberships
                .map(m => m.group)
                .filter(group => group && group.owner.toString() !== userId);

            // Merge and deduplicate (optional but safe)
            const allGroups = [...ownedGroups, ...memberGroups];*/

            // Apply limit
            const limitedGroups = ownedGroups.slice(0, limit);

            return res.json(limitedGroups);
        } catch (err) {
            return res.status(500).json({
                error: err,
                message: "Failed to list groups"
            });
        }
    },
    listByUser: async function (req, res) {
        try {
            const userId = req.user.id;

            // 1. Groups the user owns
            const ownedGroups = await GroupModel.find({ owner: userId });

            // 2. Membership records where the user is a member
            const memberships = await GroupMemberModel.find({ member: userId }).populate('group');

            const memberGroups = memberships
                .map(m => m.group)
                .filter(group => group.owner.toString() !== userId);

            return res.json({
                owned: ownedGroups,
                membered: memberGroups
            });
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

            var group = await GroupModel
                .findOne({_id: id})
                .populate('owner')

            if (!group) {
                return res.status(404).json({
                    message: 'Group does not exist'
                })
            }


            if (!group.isPrivate) {
                const groupMembers = await GroupMemberModel
                    .find({group: group._id})
                    .populate('member')
                const groupObj = group.toObject();
                groupObj.members = groupMembers;
                groupObj.isMember = groupMembers.some(
                    gm => gm.member._id.toString() === req.user.id.toString()
                )
                groupObj.isOwner = req.user.id.toString() === group.owner._id.toString();
                return res.json(groupObj)
            }
            const groupObj = group.toObject();


            const groupMembers = await GroupMemberModel
                .find({group: group._id})
                .populate('member')

            var isMember = false
            if (!groupMembers) {
                isMember = false
            } else{
                isMember = groupMembers.some(
                    gm => gm.member._id === req.user.id
                )
            }
            groupObj.isMember = isMember;

            groupObj.isOwner = req.user.id.toString() === group.owner._id.toString();
            if(!isMember && !groupObj.isOwner) {
                return res.json(groupObj);
            }else {
                groupObj.members = groupMembers;
                return res.json(groupObj);
            }
        } catch (err) {
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
        var group = new GroupModel({
            name: req.body.name,
            isPrivate: req.body.isPrivate,
            owner: req.user.id
        });
        try {
            var savedGroup = await group.save();
            var groupMember = new GroupMemberModel({
                member: req.user.id,
                group: savedGroup._id
            })
            var member = await groupMember.save()
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
            const groupId = req.body.groupId;
            const group = await GroupModel.findOne({_id: groupId, isPrivate: false});
            if (!group) {
                return res.status(400).json({
                    message: 'Cannot join a private group or a nonexistent one',
                    error: new Error('')
                });
            }
            let groupMember = await GroupMemberModel.findOne({group: groupId, member: req.user.id});
            if (!groupMember) {
                groupMember = new GroupMemberModel({
                    member: req.user.id,
                    group: groupId,
                })
                await groupMember.save()
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

            const groupId = req.body.group;
            const ownerId = req.user.id;
            const memberId = req.body.member;
            const group = await GroupModel.findOne({_id: groupId, owner: ownerId});

            if (!group) {

                return res.status(400).json({
                    message: 'Cannot add a member to group that you don\'t own or a nonexistent one',
                    error: new Error('')
                });
            }

            let groupMember = await GroupMemberModel.findOne({group: groupId, member: memberId});

            if (!groupMember) {

                groupMember = new GroupMemberModel({
                    member: memberId,
                    group: groupId,
                })
                var saved = await groupMember.save()
                return res.json(saved)
            } else {

                return res.status(400).json({
                    message: 'Already joined the group',
                    error: new Error('already joined the group'),
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
