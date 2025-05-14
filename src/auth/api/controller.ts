import { Body, Controller, Post } from '@nestjs/common';

import { TokenIssuerService } from '../services/tokenIssuerService';
import { ApiCreateTokenRequest, ApiCreateTokenResponse } from './types';
import { TenantID } from 'src/tenants/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenIssuerService: TokenIssuerService) {}

  @Post('tokens')
  createToken(
    @Body() request: ApiCreateTokenRequest,
  ): Promise<ApiCreateTokenResponse> {
    return this.tokenIssuerService
      .issueToken({
        role: request.parameters.role,
        tenantId:
          'tenantId' in request.parameters
            ? (request.parameters.tenantId as TenantID)
            : (undefined as unknown as TenantID),
      })
      .map(({ token }) => ({
        bearerToken: token,
      }))
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }
}
