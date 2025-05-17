var express = require('express');
var router = express.Router();
var groupController = require('../controllers/groupController.js');
var auth = require("../middleware/auth.js");

/*
 * GET
 */
router.get('/', groupController.list);

/*
 * GET
 */
router.get('/:id', groupController.show);

/*
 * POST
 */
router.post('/', auth, groupController.create);

/*
 * PUT
 */
router.put('/:id', groupController.update);

/*
 * DELETE
 */
router.delete('/:id', groupController.remove);

module.exports = router;
