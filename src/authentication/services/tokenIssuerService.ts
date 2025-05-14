import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IssueTokenRequest, IssueTokenResponse } from './types';
import { ResultAsync } from 'neverthrow';

@Injectable()
export class TokenIssuerService {
  constructor(private readonly jwtService: JwtService) {}

  issueToken(
    request: IssueTokenRequest,
  ): ResultAsync<IssueTokenResponse, Error> {
    return ResultAsync.fromPromise(
      (() => {
        const claims = (function () {
          return {
            role: request.role,
            tid: 'tenantId' in request ? request.tenantId : undefined,
          };
        })();
        const token = this.jwtService.sign(claims);

        return Promise.resolve({
          bearerToken: token,
        });
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }
}
