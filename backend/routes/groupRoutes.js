var express = require('express');
var router = express.Router();
var groupController = require('../controllers/groupController.js');
var auth = require("../middleware/auth.js");
const multer = require("multer");
const upload = multer({dest: 'public/groups/'})
/*
 * GET
 */
router.get('/', auth, groupController.list);

/*
 * GET
 */
router.get('/userGroups', auth, groupController.listByUser);
router.get('/find', auth, groupController.listSearch)
router.get('/:id', auth, groupController.show);



/*
 * POST
 */
router.post('/', auth, upload.single('image'), groupController.create);

router.post('/join', auth, groupController.join);

router.post('/add', auth, groupController.addMember);


/*
 * DELETE
 */

module.exports = router;
