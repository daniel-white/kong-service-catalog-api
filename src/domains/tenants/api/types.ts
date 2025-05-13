export interface ApiTenant {
  id: string;
  name: string;
}

export interface ApiCreateTenantRequest {
  name: string;
}

export type ApiCreateTenantResponse = ApiTenant;

export type ApiGetTenantResponse = ApiTenant;
