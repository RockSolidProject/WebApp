var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController.js');
var auth = require('../middleware/auth.js');
const multer = require('multer');

const upload = multer({dest: 'public/events/'});

/*
 * GET
 */
router.get('/', auth, eventController.list);
router.get('/:id', auth, eventController.show);


/*
 * GET
 */

/*
 * POST
 */
router.post('/', auth, upload.single('image'), eventController.create);

/*
 * DELETE
 */

module.exports = router;
