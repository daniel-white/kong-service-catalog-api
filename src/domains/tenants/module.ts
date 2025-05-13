import { Module } from '@nestjs/common';
import { TenantsController } from './api/controller';
import { TenantsDataService } from './data/dataService';
import { DatabaseModule } from 'src/database/module';

@Module({
  imports: [DatabaseModule],
  controllers: [TenantsController],
  providers: [TenantsDataService],
})
export class TenantsDomainModule {}
