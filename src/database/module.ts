import { Module } from '@nestjs/common';
import { DataSourceModule } from './dataSource';
import { servicesRepositoryProvider } from '../services/data/entities';
@Module({
  imports: [DataSourceModule],
  providers: [servicesRepositoryProvider],
  exports: [DataSourceModule, servicesRepositoryProvider],
})
export class DatabaseModule {}
