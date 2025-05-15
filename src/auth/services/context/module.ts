import { Module } from '@nestjs/common';
import { ClientContextService } from './clientContextService';
import { TenantsDataModule } from 'src/tenants/services/data/module';

@Module({
  imports: [TenantsDataModule],
  providers: [ClientContextService],
  exports: [ClientContextService],
})
export class AuthContextModule {}
