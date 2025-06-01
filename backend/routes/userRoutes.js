var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const auth = require("../middleware/auth.js");
const multer = require('multer')
const upload = multer({dest: 'public/avatars/'});

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
