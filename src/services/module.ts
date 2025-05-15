import { Module } from '@nestjs/common';
import { ServicesController } from './api/controller';
import { ServicesDataModule } from './services/data/module';
import { AuthContextModule } from 'src/auth/services/context/module';

@Module({
  imports: [ServicesDataModule, AuthContextModule],
  controllers: [ServicesController],
  providers: [],
  exports: [],
})
export class ServicesModule {}
