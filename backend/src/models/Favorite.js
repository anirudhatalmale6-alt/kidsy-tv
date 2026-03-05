const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  channelId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  videoId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('channel', 'video'),
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: true,
});

module.exports = Favorite;
