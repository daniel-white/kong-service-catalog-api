import {
  Injectable,
  NestMiddleware,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenValidatorService } from '../services/tokenValidatorService';
import { Client, ClientContextService } from '../services/clientContextService';
import { okAsync } from 'neverthrow';
import { tenantIdSchema } from 'src/tenants/types';

@Injectable({
  scope: Scope.REQUEST,
})
export class ClientContextMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenValidationService: TokenValidatorService,
    private readonly clientContextService: ClientContextService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const [, token] =
      /^(?:bearer )?(.+)$/i.exec(req.headers['authorization'] ?? '') ?? [];
    const tenantIdFromHeader = tenantIdSchema.safeParse(
      req.headers['x-tenant-id'],
    ).data;

    (!token
      ? okAsync({ role: 'anonymous' })
      : this.tokenValidationService
          .validateToken({ token })
          .map((claims) => ({
            role: claims.role,
            ...(claims.role !== 'root'
              ? { tenantId: claims.tenantId }
              : { tenantId: tenantIdFromHeader }),
          }))
          .mapErr(() => new UnauthorizedException())
    )
      .andTee((client: Client) => this.clientContextService.setClient(client))
      .andTee(() => {
        console.log('Client context set', this.clientContextService);
        next();
      })
      .orTee(() => next(new UnauthorizedException()));
  }
}
