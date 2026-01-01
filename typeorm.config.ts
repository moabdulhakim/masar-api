import { DataSource } from 'typeorm';
import dbConfigDevelopment from './src/config/db.config.development';
import dbConfigProduction from './src/config/db.config.production';
import { config } from 'dotenv';

config();

export default new DataSource(
  process.env.NODE_ENV === 'production' ? dbConfigProduction() : dbConfigDevelopment()
);