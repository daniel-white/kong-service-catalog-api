import { Module } from '@nestjs/common';
import { TenantsController } from './api/controller';
import { TenantsDataService } from './services/dataService';
import { DatabaseModule } from 'src/database/module';
import { tenantsRepositoryProvider } from './services/entities';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantsController],
  providers: [TenantsDataService, tenantsRepositoryProvider],
  exports: [TenantsDataService],
})
export class TenantsModule {}
