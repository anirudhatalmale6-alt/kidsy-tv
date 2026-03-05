const router = require('express').Router();
const ctrl = require('../controllers/videoController');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const { videoUpload, imageUpload } = require('../middleware/upload');

const path = require('path');
const crypto = require('crypto');

const uploadFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'video') cb(null, path.join(__dirname, '../../uploads/videos'));
      else cb(null, path.join(__dirname, '../../uploads/thumbnails'));
    },
    filename: (req, file, cb) => {
      cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

router.get('/', ctrl.getAll);
router.get('/search', ctrl.search);
router.get('/admin', adminAuth, ctrl.getAllAdmin);
router.get('/:id', ctrl.getById);
router.post('/', adminAuth, uploadFields, ctrl.create);
router.put('/:id', adminAuth, uploadFields, ctrl.update);
router.delete('/:id', adminAuth, ctrl.remove);

module.exports = router;
