const sequelize = require('../config/database');
const Admin = require('./Admin');
const User = require('./User');
const Category = require('./Category');
const Channel = require('./Channel');
const Video = require('./Video');
const Favorite = require('./Favorite');
const WatchHistory = require('./WatchHistory');

// Associations
Category.hasMany(Channel, { foreignKey: 'categoryId', as: 'channels' });
Channel.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Category.hasMany(Video, { foreignKey: 'categoryId', as: 'videos' });
Video.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(Channel, { foreignKey: 'channelId', as: 'channel' });
Favorite.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

User.hasMany(WatchHistory, { foreignKey: 'userId', as: 'watchHistory' });
WatchHistory.belongsTo(User, { foreignKey: 'userId' });
WatchHistory.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

module.exports = {
  sequelize,
  Admin,
  User,
  Category,
  Channel,
  Video,
  Favorite,
  WatchHistory,
};
