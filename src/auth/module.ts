import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './api/controller';
import { ClientContextMiddleware } from './api/clientContextMiddleware';
import { TokensModule } from './services/tokens/module';
import { AuthContextModule } from './services/context/module';

@Module({
  imports: [TokensModule, AuthContextModule],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientContextMiddleware)
      .exclude('auth/*path')
      .forRoutes('*');
  }
}
