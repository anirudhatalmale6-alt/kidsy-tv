const { Channel, Category } = require('../models');
const { resolveStreamUrl } = require('../utils/streamResolver');

const getAll = async (req, res) => {
  try {
    const where = { isActive: true };
    if (req.query.categoryId) where.categoryId = req.query.categoryId;

    const channels = await Channel.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'nameAr'] }],
      order: [['order', 'ASC'], ['name', 'ASC']],
    });
    res.json({ channels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const channels = await Channel.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ channels });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    channel.viewCount += 1;
    await channel.save();

    res.json({ channel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo = `/uploads/logos/${req.file.filename}`;
    // Auto-resolve Castr player URLs to direct stream URLs
    if (data.streamUrl) {
      data.resolvedUrl = await resolveStreamUrl(data.streamUrl);
    }
    const channel = await Channel.create(data);
    res.status(201).json({ channel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const data = { ...req.body };
    if (req.file) data.logo = `/uploads/logos/${req.file.filename}`;
    // Auto-resolve Castr player URLs to direct stream URLs
    if (data.streamUrl) {
      data.resolvedUrl = await resolveStreamUrl(data.streamUrl);
    }
    await channel.update(data);
    res.json({ channel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    await channel.destroy();
    res.json({ message: 'Channel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getAllAdmin, getById, create, update, remove };
