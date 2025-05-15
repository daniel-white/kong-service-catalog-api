import { Injectable, Scope } from '@nestjs/common';
import { TenantID } from '../../../tenants/types';
import { ok, okAsync, ResultAsync } from 'neverthrow';
import {
  TenantNotFoundError,
  TenantsDataService,
} from 'src/tenants/services/data/dataService';

export type ClientRole =
  | 'anonymous'
  | 'root'
  | 'tenant-admin'
  | 'tenant-viewer';

export type Client =
  | { role: 'anonymous' }
  | {
      role: 'root';
      tenantId?: TenantID;
    }
  | {
      role: 'tenant-admin' | 'tenant-viewer';
      tenantId: TenantID;
    };

@Injectable({
  scope: Scope.REQUEST,
})
export class ClientContextService {
  private client: Client = { role: 'anonymous' };

  constructor(private readonly tenantDataService: TenantsDataService) {}

  setClient(client: Client): ResultAsync<void, Error> {
    return this.validateTenantId(
      'tenantId' in client ? client.tenantId : undefined,
    )
      .andThen(() => {
        this.client = client;
        return ok();
      })
      .mapErr((e) => {
        if (e instanceof TenantNotFoundError) {
          return new RangeError(`Invalid tenant`);
        }
        return e;
      });
  }

  get isAuthenticated(): boolean {
    return this.role !== 'anonymous';
  }

  get role(): ClientRole {
    return this.client.role;
  }

  get tenantId(): TenantID | undefined {
    if (this.client.role === 'anonymous') {
      throw new RangeError('Anonymous client does not have a tenantId');
    }

    return this.client.tenantId;
  }

  private validateTenantId(
    tenantId: TenantID | undefined,
  ): ResultAsync<void, Error> {
    if (tenantId) {
      return this.tenantDataService
        .getTenant({ id: tenantId })
        .andThen(() => ok());
    } else {
      return okAsync(undefined);
    }
  }
}
