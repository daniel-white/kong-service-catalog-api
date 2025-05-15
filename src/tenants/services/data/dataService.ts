import { ResultAsync } from 'neverthrow';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DatabaseTenantsRepository, TenantEntity } from './entities';
import { Repository } from 'typeorm';
import { TenantID, TenantName } from '../../types';
import { NotFoundError } from '../../../core/errors';

export interface Tenant {
  id: TenantID;
  name: TenantName;
}

export interface CreateTenantRequest {
  name: TenantName;
}

export type CreateTenantResponse = Tenant;

export interface GetTenantRequest {
  id: TenantID;
}

export type GetTenantResponse = Tenant;

export class TenantNotFoundError extends NotFoundError {}

@Injectable({
  scope: Scope.REQUEST,
})
export class TenantsDataService {
  constructor(
    @Inject(DatabaseTenantsRepository)
    private readonly repository: Repository<TenantEntity>,
  ) {}

  createTenant(
    request: CreateTenantRequest,
  ): ResultAsync<CreateTenantResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenant = this.repository.create({
          name: request.name,
        });
        const savedTenant = await this.repository.save(tenant);
        return {
          id: savedTenant.id,
          name: savedTenant.name,
        };
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }

  getTenant(request: GetTenantRequest): ResultAsync<GetTenantResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenant = await this.repository.findOneBy({
          id: request.id,
        });
        if (!tenant) {
          throw new TenantNotFoundError('Tenant not found');
        }
        return {
          id: tenant.id,
          name: tenant.name,
        };
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
