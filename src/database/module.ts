import { Module } from '@nestjs/common';
import { dataSourceModule } from './dataSource';
import { servicesRepositoryProvider } from './entities/services';
import { tenantsRepositoryProvider } from './entities/tenants';

@Module({
  providers: [servicesRepositoryProvider, tenantsRepositoryProvider],
  exports: [
    dataSourceModule,
    servicesRepositoryProvider,
    tenantsRepositoryProvider,
  ],
})
export class DatabaseModule {}
