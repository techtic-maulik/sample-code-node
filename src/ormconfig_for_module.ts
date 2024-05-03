import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { ConfigService } from './common/config.service';

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  host: ConfigService.get('DB_HOST'),
  port: ConfigService.get('DB_PORT'),
  username: ConfigService.get('DB_USERNAME'),
  password: ConfigService.get('DB_PASSWORD'),
  database: ConfigService.get('DB_DATABASE'),
  ssl: false, // For insecure connections only
  /* ssl: true,
    extra: {
        options: "--cluster=<routing-id>"
    }, */
  synchronize: false,
  logging: false,
  logger: 'file',
  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '**/*{.ts,.js}')],
  subscribers: ['src/subscriber/**/*.ts'],
};

export default config;
