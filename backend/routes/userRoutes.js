var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const auth = require("../middleware/auth.js");
const multer = require('multer')
const upload = multer({dest: 'public/avatars/'});
const axios = require('axios');

const { OAuth2Client } = require('google-auth-library');
const oauth2Client = new OAuth2Client()
/*
 * GET
 */
router.get('/test', function(req, res, next) {
    res.json({ message: 'Connection successful!' });
});

/*
 * GET
 */
router.get('/:id', auth, userController.show);
router.get('/', userController.list);
/*
 * POST
 */
router.post('/googleAuth', async (req, res, next) => {
    try {
        const code = req.headers.authorization;
        if (!code) {
            return res.status(400).json({ message: 'Authorization code missing' });
        }

        console.log("Authorization Code:", code);

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code',
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).json({ message: 'Access token not found' });
        }

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        req.googleUser = userResponse.data;
        next();

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: "Google authentication failed" });
    }
}, userController.login);

router.post('/', userController.create);
router.post('/login', userController.login);

/*
 * PUT
 */
router.put('/avatar/:id', auth, upload.single('avatar'), userController.setAvatar);
/*
 * DELETE
 */
router.delete('/:id', auth, userController.remove);

module.exports = router;
