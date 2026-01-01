import { join } from "path";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default (): PostgresConnectionOptions => (
    {
      type: 'postgres',
      url: process.env.DATABASE_URL_DEVELOPMENT,
      entities: [join(__dirname, '..', '..', '**', '*.entity.js')],
      migrations: [join(__dirname, '..', '..','dist', 'src', 'db', 'migrations', '*.js')],
      synchronize: true,
      logging: false, // set to true to enable query logging for debugging
      ssl: {
        rejectUnauthorized: false,
      },
    }
)