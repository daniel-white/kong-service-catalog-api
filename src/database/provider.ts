import { DataSource } from 'typeorm';
import { join } from 'node:path';

export const dataSource = new DataSource({
  type: 'postgres',
  entities: [join(__dirname, '../**/entities/*.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});

export const provider = {
  provide: 'DATABASE_SOURCE',
  useFactory: () => {
    return dataSource.initialize();
  },
};
