const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, Admin } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Kidsy TV API', version: '1.0.0' });
});

// Serve admin panel
app.use(express.static(path.join(__dirname, '../admin-dist')));
app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin-dist/index.html'));
});

const PORT = process.env.PORT || 3500;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Create default admin
    const adminExists = await Admin.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await Admin.create({ username: 'admin', password: 'admin123', name: 'Admin' });
      console.log('Default admin created: admin / admin123');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Kidsy TV API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};

start();
