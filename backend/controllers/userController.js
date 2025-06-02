var UserModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const {hash} = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
var RouteClimbedModel = require('../models/routeClimbedModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    list: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit);
            const search = req.query.search;
            const users = await UserModel.find({
                username: {$regex: search, $options: 'i'}
            }).limit(limit);
            res.json(users);
        } catch (err) {
            return res.status(500).send({
                error: err,
                message: 'Something went wrong'
            })
        }
    },
    /**
     * userController.show()
     */
    show: async function (req, res) {
        const id = req.params.id;
        try {

            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({message: 'No such user'});
            }
            if (user._id.toString() !== req.user.id.toString()) {
                return res.status(404).json({message: "Access denied: Wrong user."})
            }

            const routesClimbed = await RouteClimbedModel
                .find({postedBy: req.user.id})
                .populate('climbingRoute')
            const userObj = user.toObject();

            userObj.routesClimbed = routesClimbed;
            console.log("here")

            return res.json(userObj);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting the user.',
                error: err.message
            });
        }
    },

    setAvatar: async function (req, res) {
        const id = req.params.id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: 'No file uploaded.'
            });
        }

        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user._id.toString() !== req.user.id) {
                return res.status(403).json({ message: "Access denied: Wrong user." });
            }

            user.avatar = `/avatars/${file.filename}`;
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
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            const savedUser = await user.save()
            return res.status(201).json(savedUser)
        } catch (err) {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
                return res.status(409).json({
                    message: 'Username already exists'
                });
            }
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            })
        }
    },

    login: async function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        try {
            const user = await UserModel.findOne({username: username});
            if (!user) {
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
                avatar: user.avatar
            }

            return res.json({token: jwtToken, userData: userData})

        } catch (err) {
            return res.status(500).json({
                message: 'Error when logging in',
                error: err
            })
        }

    },

    /**
     * userController.update()
     */
    /*update: async function (req, res) {
        var id = req.params.id;
        try {
            const user = await UserModel.findById(id)
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            } else {
                if (user._id.toString() !== req.user.id) {
                    return res.status(403).json({message: "Access denied: Wrong user."})
                }

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

    },*/

    /**
     * userController.remove()
     */
    remove: async function (req, res) {
        const id = req.params.id;
        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({message: 'No such user'});
            }
            if (user._id.toString() !== req.user.id) {
                return res.status(403).json({message: "Access denied: Wrong user."})
            }
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the user.',
                error: err
            });
        }
    },
    googleLogin: async (req, res) => {
        const googleUser = req.googleUser;
        const { email, sub: googleId, name: username, picture: avatar } = googleUser;

        try {
            let user = await UserModel.findOne({ googleId });

            if (!user) {
                // If user with googleId doesn't exist, check if user with email exists
                user = await UserModel.findOne({ email });
                if (user && !user.googleId) {
                    // attach googleId if email match but no googleId yet
                    user.googleId = googleId;
                } else if (!user) {
                    // create new user
                    user = new UserModel({
                        username,
                        email,
                        googleId,
                        avatar,
                    });
                }

                await user.save();
            }

            // Generate JWT
            const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.json({
                token,
                userData: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Google login error", error: err.message });
        }
    }
};
