import { Module } from '@nestjs/common';
import { DataSourceModule } from './dataSource';
import { servicesRepositoryProvider } from './entities/services';
import { tenantsRepositoryProvider } from './entities/tenants';

@Module({
  imports: [DataSourceModule],
  providers: [servicesRepositoryProvider, tenantsRepositoryProvider],
  exports: [
    DataSourceModule,
    servicesRepositoryProvider,
    tenantsRepositoryProvider,
  ],
})
export class DatabaseModule {}
