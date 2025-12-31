import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, 'dist', '**', '*.entity.js')],
  migrations: [join(__dirname, 'dist', 'src', 'db', 'migrations', '*.js')],
  ssl: { rejectUnauthorized: false },
});