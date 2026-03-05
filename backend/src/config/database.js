const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dbDialect === 'sqlite') {
  const projectRoot = path.join(__dirname, '..', '..');
  let storagePath = process.env.DB_STORAGE || path.join(projectRoot, 'data', 'kidsy_tv.db');
  // Resolve relative paths against project root, not CWD
  if (!path.isAbsolute(storagePath)) {
    storagePath = path.join(projectRoot, storagePath);
  }
  // Ensure the data directory exists
  const fs = require('fs');
  const dataDir = path.dirname(storagePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
} else {
  const config = {
    dialect: dbDialect,
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  };

  if (process.env.DB_HOST && process.env.DB_HOST.startsWith('/')) {
    config.host = process.env.DB_HOST;
    config.port = parseInt(process.env.DB_PORT) || 5432;
  } else {
    config.host = process.env.DB_HOST || 'localhost';
    config.port = parseInt(process.env.DB_PORT) || 5432;
  }

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || null,
    config
  );
}

module.exports = sequelize;
