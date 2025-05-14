import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResultAsync } from 'neverthrow';
import { TenantID } from '../../tenants/types';

export type ValidateTokenRequest = {
  token: string;
};

export type ValidateTokenResponse =
  | {
      role: 'root';
    }
  | {
      role: 'tenant-admin' | 'tenant-viewer';
      tenantId: TenantID;
    };

@Injectable()
export class TokenValidatorService {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(
    request: ValidateTokenRequest,
  ): ResultAsync<ValidateTokenResponse, Error> {
    return ResultAsync.fromPromise(
      (() => {
        return Promise.resolve(
          this.jwtService.verify<{ role: string; tid: string }>(request.token),
        );
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    ).map(
      (claims) =>
        ({
          role: claims.role,
          tenantId: claims.tid,
        }) as ValidateTokenResponse,
    );
  }
}
