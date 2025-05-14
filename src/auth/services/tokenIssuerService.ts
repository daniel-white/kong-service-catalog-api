import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { err, ok, okAsync, ResultAsync } from 'neverthrow';
import { TenantsDataService } from '../../tenants/services/dataService';
import { TenantID } from '../../tenants/types';
import { NotFoundError } from '../../core/errors';

export type IssueTokenRequest =
  | {
      role: 'root';
    }
  | {
      role: 'tenant-admin' | 'tenant-viewer';
      tenantId: TenantID;
    };

export type IssueTokenResponse = {
  token: string;
};

@Injectable()
export class TokenIssuerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tenantDataService: TenantsDataService,
  ) {}

  issueToken(
    request: IssueTokenRequest,
  ): ResultAsync<IssueTokenResponse, Error> {
    return this.validateTenantId(request).andThen((tenantId) => {
      const claims = (function () {
        return {
          role: request.role,
          tid: tenantId,
        };
      })();
      const token = this.jwtService.sign(claims);
      return ok({ token });
    });
  }

  private validateTenantId(
    request: IssueTokenRequest,
  ): ResultAsync<TenantID | undefined, Error> {
    if (
      'tenantId' in request &&
      ['tenant-admin', 'tenant-viewer'].includes(request.role)
    ) {
      return this.tenantDataService
        .getTenant({ id: request.tenantId })
        .andThen(({ id }) => ok(id))
        .orElse((e) => {
          if (e instanceof NotFoundError) {
            ok(undefined);
          }
          return err(e);
        });
    } else {
      return okAsync(undefined);
    }
  }
}
