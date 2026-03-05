const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { adminAuth, userAuth } = require('../middleware/auth');

// Admin routes
router.get('/admin/all', adminAuth, ctrl.getAllUsers);
router.put('/admin/:id/toggle', adminAuth, ctrl.toggleUserActive);
router.delete('/admin/:id', adminAuth, ctrl.deleteUser);
router.get('/admin/dashboard', adminAuth, ctrl.getDashboardStats);

// User routes
router.post('/favorites', userAuth, ctrl.addFavorite);
router.delete('/favorites/:id', userAuth, ctrl.removeFavorite);
router.get('/favorites', userAuth, ctrl.getFavorites);
router.post('/history', userAuth, ctrl.addWatchHistory);
router.get('/history', userAuth, ctrl.getWatchHistory);

module.exports = router;
