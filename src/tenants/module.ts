import { Module } from '@nestjs/common';
import { TenantsController } from './api/controller';
import { tenantsRepositoryProvider } from './services/data/entities';
import { TenantsDataModule } from './services/data/module';
import { AuthContextModule } from 'src/auth/services/context/module';

@Module({
  imports: [TenantsDataModule, AuthContextModule],
  controllers: [TenantsController],
  providers: [tenantsRepositoryProvider],
  exports: [],
})
export class TenantsModule {}
