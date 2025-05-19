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

/*
 * POST
 */
router.post('/', auth, eventController.create);

/*
 * DELETE
 */

module.exports = router;
