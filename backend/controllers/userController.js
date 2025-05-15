var UserModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const {hash} = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "some_secret_key"

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.show()
     */
    show: async function(req, res) {
        const id = req.params.id;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'No such user' });
            }
            return res.json(user);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting the user.',
                error: err.message
            });
        }
    },

    setAvatar: async function(req, res) {
        const id = req.params.id;
        const avatar = req.body.avatar;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.avatar = avatar;
            const updatedUser = await user.save();
            return res.json(updatedUser);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating avatar',
                error: err.message
            });
        }
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            var user = new UserModel({
                username : req.body.username,
                email : req.body.email,
                password : hashedPassword,
                avatar : req.body.avatar,
                createdAt : new Date()
            });
            const savedUser = await user.save()
            return res.status(201).json(savedUser)
        }
        catch(err){
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            })
        }
    },

    login: async function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        try{
            const user = await UserModel.findOne({username: username});
            if(!user){
                return res.status(401).json({
                    message: 'Invalid username or password'
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({
                message: 'Invalid username or password'
                })
            }
            
            const jwtToken = jwt.sign({
                id: user._id,
                username: username
            }, JWT_SECRET_KEY, {expiresIn: '1h'})

            const userData = {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avarar
            }

            return res.json({token: jwtToken, userData: userData})

        }
        catch(err){
            return res.status(500).json({
                message: 'Error when logging in',
                error: err
            })
        }

    },

    /**
     * userController.update()
     */
    update: async function (req, res) {
        var id = req.params.id;
        try {
            const user = await UserModel.findById(id)
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            } else {
                //update user
                user.username = req.body.username ? req.body.username : user.username;
                user.email = req.body.email ? req.body.email : user.email;
                user.password = req.body.password ? req.body.password : user.password;
                user.avatar = req.body.avatar ? req.body.avatar : user.avatar;
                user.createdAt = req.body.createdAt ? req.body.createdAt : user.createdAt;

                const updateUser = await user.save()
                return res.json(updateUser)
            }
        } catch(err){
            return res.status(500).json({
                message: 'Error when updating user',
                error: err
            })
        }

    },

    /**
     * userController.remove()
     */
    remove: async function(req, res) {
        const id = req.params.id;
        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: 'No such user' });
            }
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the user.',
                error: err
            });
        }
    },
};
