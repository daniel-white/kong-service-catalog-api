import { Module } from '@nestjs/common';
import { ServicesDataService } from './dataService';
import { DatabaseModule } from 'src/database/module';
import {
  servicesRepositoryProvider,
  serviceVersionsRepositoryProvider,
} from './entities';
import { AuthContextModule } from 'src/auth/services/context/module';

@Module({
  imports: [DatabaseModule, AuthContextModule],
  providers: [
    ServicesDataService,
    servicesRepositoryProvider,
    serviceVersionsRepositoryProvider,
  ],
  exports: [ServicesDataService],
})
export class ServicesDataModule {}
