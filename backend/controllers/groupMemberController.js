var GroupmemberModel = require('../models/groupMemberModel.js');

/**
 * groupMemberController.js
 *
 * @description :: Server-side logic for managing groupMembers.
 */
module.exports = {

    /**
     * groupMemberController.list()
     */
    list: function (req, res) {
        GroupmemberModel.find(function (err, groupMembers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting groupMember.',
                    error: err
                });
            }

            return res.json(groupMembers);
        });
    },

    /**
     * groupMemberController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GroupmemberModel.findOne({_id: id}, function (err, groupMember) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting groupMember.',
                    error: err
                });
            }

            if (!groupMember) {
                return res.status(404).json({
                    message: 'No such groupMember'
                });
            }

            return res.json(groupMember);
        });
    },

    /**
     * groupMemberController.create()
     */
    create: function (req, res) {
        var groupMember = new GroupmemberModel({
			group : req.body.group,
			member : req.body.member
        });

        groupMember.save(function (err, groupMember) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating groupMember',
                    error: err
                });
            }

            return res.status(201).json(groupMember);
        });
    },

    /**
     * groupMemberController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        GroupmemberModel.findOne({_id: id}, function (err, groupMember) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting groupMember',
                    error: err
                });
            }

            if (!groupMember) {
                return res.status(404).json({
                    message: 'No such groupMember'
                });
            }

            groupMember.group = req.body.group ? req.body.group : groupMember.group;
			groupMember.member = req.body.member ? req.body.member : groupMember.member;
			
            groupMember.save(function (err, groupMember) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating groupMember.',
                        error: err
                    });
                }

                return res.json(groupMember);
            });
        });
    },

    /**
     * groupMemberController.remove()
     */
};
