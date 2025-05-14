import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateTokenRequest, ValidateTokenResponse } from './types';
import { ResultAsync } from 'neverthrow';

@Injectable()
export class TokenValidatorService {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(
    request: ValidateTokenRequest,
  ): ResultAsync<ValidateTokenResponse, Error> {
    return ResultAsync.fromPromise(
      (() => {
        return Promise.resolve(
          this.jwtService.verify<ValidateTokenResponse>(request.bearerToken),
        );
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
