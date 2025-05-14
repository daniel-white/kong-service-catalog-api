import { z } from 'zod';
import { tenantIdSchema, tenantNameSchema } from '../types';
import { createZodDto } from 'nestjs-zod';

export interface ApiTenant {
  id: string;
  name: string;
}

const ApiCreateTenantRequestSchema = z.object({
  name: tenantNameSchema,
});

export class ApiCreateTenantRequest extends createZodDto(
  ApiCreateTenantRequestSchema,
) {}

export type ApiCreateTenantResponse = ApiTenant;

const ApiGetTenantRequestParamsSchema = z.object({
  id: tenantIdSchema,
});

export class ApiGetTenantRequestParams extends createZodDto(
  ApiGetTenantRequestParamsSchema,
) {}

export type ApiGetTenantResponse = ApiTenant;
