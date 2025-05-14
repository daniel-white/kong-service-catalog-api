import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [join(__dirname, '../**/entities.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  logging: true,
};

export default new DataSource(dataSourceOptions);

export const DataSourceModule = TypeOrmModule.forRootAsync({
  useFactory: () => dataSourceOptions,
});
