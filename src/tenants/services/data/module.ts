import { Module } from '@nestjs/common';
import { TenantsDataService } from './dataService';
import { DatabaseModule } from 'src/database/module';
import { tenantsRepositoryProvider } from './entities';

@Module({
  imports: [DatabaseModule],
  providers: [TenantsDataService, tenantsRepositoryProvider],
  exports: [TenantsDataService],
})
export class TenantsDataModule {}
