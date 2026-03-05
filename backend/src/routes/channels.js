const router = require('express').Router();
const ctrl = require('../controllers/channelController');
const { adminAuth } = require('../middleware/auth');
const { logoUpload } = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.get('/admin', adminAuth, ctrl.getAllAdmin);
router.get('/:id', ctrl.getById);
router.post('/', adminAuth, logoUpload.single('logo'), ctrl.create);
router.put('/:id', adminAuth, logoUpload.single('logo'), ctrl.update);
router.delete('/:id', adminAuth, ctrl.remove);

module.exports = router;
