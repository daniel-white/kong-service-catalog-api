import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as BaseJwtModule } from '@nestjs/jwt';

export const JwtModule = BaseJwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('TOKEN_SECRET'),
  }),
  inject: [ConfigService],
});
