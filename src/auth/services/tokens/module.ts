import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenIssuerService } from './tokenIssuerService';
import { TokenValidatorService } from './tokenValidatorService';
import { TenantsDataModule } from 'src/tenants/services/data/module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TenantsDataModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenIssuerService, TokenValidatorService],
  exports: [TokenIssuerService, TokenValidatorService],
})
export class TokensModule {}
