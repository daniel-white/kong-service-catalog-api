import type { TenantID } from '../../../database/entities/tenants';
import { NotFoundError } from '../../../core/errors';

export interface Tenant {
  id: TenantID;
  name: string;
}

export interface CreateTenantRequest {
  name: string;
}

export type CreateTenantResponse = Tenant;

export interface GetTenantRequest {
  id: TenantID;
}

export type GetTenantResponse = Tenant;

export class TenantNotFoundError extends NotFoundError {}
