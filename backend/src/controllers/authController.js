const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');
require('dotenv').config();

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await admin.validatePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userRegister = async (req, res) => {
  try {
    const { name, phone, country } = req.body;
    if (!name || !phone || !country) {
      return res.status(400).json({ error: 'Name, phone, and country are required' });
    }

    let user = await User.findOne({ where: { phone } });
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({ name, phone, country, lastLogin: new Date() });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, country: user.country } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { adminLogin, userRegister, userProfile };
