const router = require('express').Router();
const { adminLogin, userRegister, userProfile } = require('../controllers/authController');
const { userAuth } = require('../middleware/auth');

router.post('/admin/login', adminLogin);
router.post('/user/register', userRegister);
router.get('/user/profile', userAuth, userProfile);

module.exports = router;
