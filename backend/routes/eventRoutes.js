var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController.js');
var auth = require('../middleware/auth.js');

/*
 * GET
 */
router.get('/', auth, eventController.list);

/*
 * GET
 */
router.get('/:id',auth, eventController.show);

/*
 * POST
 */
router.post('/', auth, eventController.create);

/*
 * DELETE
 */
router.delete('/:id', eventController.remove);

module.exports = router;
