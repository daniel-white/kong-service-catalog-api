import { Module } from '@nestjs/common';
import { ServicesDataService } from './dataService';
import { DatabaseModule } from 'src/database/module';
import { servicesRepositoryProvider } from './entities';
import { AuthContextModule } from 'src/auth/services/context/module';

@Module({
  imports: [DatabaseModule, AuthContextModule],
  providers: [ServicesDataService, servicesRepositoryProvider],
  exports: [ServicesDataService],
})
export class ServicesDataModule {}
