import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenIssuerService } from './services/tokenIssuerService';
import { TokenValidatorService } from './services/tokenValidatorService';

const ConfiguredJwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('TOKEN_SECRET'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [ConfiguredJwtModule],
  providers: [TokenIssuerService, TokenValidatorService],
  exports: [ConfiguredJwtModule],
})
export class AuthenticationModule {}
