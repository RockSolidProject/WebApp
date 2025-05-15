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
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);

/*
 * PUT
 */
router.put('/:id', userController.update);
router.put('/avatar/:id', userController.setAvatar);
/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
