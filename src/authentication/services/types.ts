import { TenantID } from '../../tenants/types';

export type IssueTokenRequest =
  | {
      role: 'root';
    }
  | {
      role: 'tenant-admin' | 'tenant-viewer';
      tenantId: TenantID;
    };

export type IssueTokenResponse = {
  bearerToken: string;
};

export type ValidateTokenRequest = {
  bearerToken: string;
};

export type ValidateTokenResponse =
  | {
      role: 'root';
    }
  | {
      role: 'tenant-admin' | 'tenant-viewer';
      tenantId: TenantID;
    };
