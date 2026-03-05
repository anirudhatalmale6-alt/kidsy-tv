const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};

// Support both Unix socket and TCP connections
if (process.env.DB_HOST && process.env.DB_HOST.startsWith('/')) {
  config.host = process.env.DB_HOST;
  config.port = parseInt(process.env.DB_PORT) || 5432;
} else {
  config.host = process.env.DB_HOST || 'localhost';
  config.port = parseInt(process.env.DB_PORT) || 5432;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || null,
  config
);

module.exports = sequelize;
