import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/module';
import { TenantsDomainModule } from './domains/tenants/module';

@Module({
  imports: [DatabaseModule, TenantsDomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
