const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WatchHistory = sequelize.define('WatchHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  watchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'watch_history',
  timestamps: true,
});

module.exports = WatchHistory;
