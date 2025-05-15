import { Module } from '@nestjs/common';
import { ServicesController } from './api/servicesController';
import { ServicesDataModule } from './services/data/module';
import { AuthContextModule } from 'src/auth/services/context/module';
import { ServiceVersionsController } from './api/serviceVersionsController';

@Module({
  imports: [ServicesDataModule, AuthContextModule],
  controllers: [ServicesController, ServiceVersionsController],
  providers: [],
  exports: [],
})
export class ServicesModule {}
