import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenIssuerService } from './services/tokenIssuerService';
import { TokenValidatorService } from './services/tokenValidatorService';
import { AuthController } from './api/controller';
import { TenantsModule } from 'src/tenants/module';
import { ClientContextMiddleware } from './api/clientContextMiddleware';
import { JwtModule } from './services/jwtModule';
import { ClientContextService } from './services/clientContextService';

@Module({
  imports: [JwtModule, TenantsModule],
  controllers: [AuthController],
  providers: [ClientContextService, TokenIssuerService, TokenValidatorService],
  exports: [ClientContextService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientContextMiddleware).exclude('auth/*').forRoutes('*');
  }
}
