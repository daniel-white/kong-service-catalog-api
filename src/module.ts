import { Module } from '@nestjs/common';
import { TenantsModule } from './tenants/module';
import { AuthModule } from './auth/module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { ServicesModule } from './services/module';

@Module({
  imports: [AuthModule, TenantsModule, ServicesModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
