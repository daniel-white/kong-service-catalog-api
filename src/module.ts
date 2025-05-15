import { Module } from '@nestjs/common';
import { TenantsModule } from './tenants/module';
import { AuthModule } from './auth/module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AuthModule, TenantsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
