var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const auth = require("../middleware/auth.js");

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

/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);

/*
 * PUT
 */
//router.put('/:id', auth, userController.update);
router.put('/avatar/:id', auth, userController.setAvatar);
/*
 * DELETE
 */
router.delete('/:id', auth, userController.remove);

module.exports = router;
