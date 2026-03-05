const { Video, Category } = require('../models');

const getAll = async (req, res) => {
  try {
    const where = { isActive: true };
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.featured === 'true') where.isFeatured = true;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: videos } = await Video.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'nameAr'] }],
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({ videos, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    video.viewCount += 1;
    await video.save();

    res.json({ video });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const search = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Search query required' });

    const videos = await Video.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: 50,
    });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.video?.[0]) {
      data.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      data.videoType = 'upload';
    }
    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }
    const video = await Video.create(data);
    res.status(201).json({ video });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const data = { ...req.body };
    if (req.files?.video?.[0]) {
      data.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      data.videoType = 'upload';
    }
    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = `/uploads/thumbnails/${req.files.thumbnail[0].filename}`;
    }
    await video.update(data);
    res.json({ video });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    await video.destroy();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getAllAdmin, getById, search, create, update, remove };
