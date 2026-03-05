const { User, Favorite, WatchHistory, Channel, Video } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { type, channelId, videoId } = req.body;
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, type, ...(channelId ? { channelId } : { videoId }) },
    });
    if (existing) return res.status(400).json({ error: 'Already in favorites' });

    const fav = await Favorite.create({
      userId: req.user.id, type, channelId, videoId,
    });
    res.status(201).json({ favorite: fav });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const fav = await Favorite.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!fav) return res.status(404).json({ error: 'Favorite not found' });
    await fav.destroy();
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Channel, as: 'channel' },
        { model: Video, as: 'video' },
      ],
    });
    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addWatchHistory = async (req, res) => {
  try {
    const { videoId, progress } = req.body;
    const [history] = await WatchHistory.upsert({
      userId: req.user.id,
      videoId,
      progress: progress || 0,
      watchedAt: new Date(),
    });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.findAll({
      where: { userId: req.user.id },
      include: [{ model: Video, as: 'video' }],
      order: [['watchedAt', 'DESC']],
      limit: 50,
    });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalChannels = await Channel.count();
    const totalVideos = await Video.count();
    const activeUsers = await User.count({ where: { isActive: true } });

    res.json({ stats: { totalUsers, totalChannels, totalVideos, activeUsers } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers, toggleUserActive, deleteUser,
  addFavorite, removeFavorite, getFavorites,
  addWatchHistory, getWatchHistory, getDashboardStats,
};
