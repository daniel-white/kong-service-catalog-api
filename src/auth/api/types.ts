import { z } from 'zod';
import { tenantIdSchema } from '../../tenants/types';
import { createZodDto } from 'nestjs-zod';

const ApiCreateTokenParametersSchema = z.union([
  z.object({
    role: z.literal('root'),
  }),
  z.object({
    role: z.enum(['tenant-admin', 'tenant-viewer']),
    tenantId: tenantIdSchema,
  }),
]);

const ApiCreateTokenRequestSchema = z.object({
  parameters: ApiCreateTokenParametersSchema,
});

export class ApiCreateTokenRequest extends createZodDto(
  ApiCreateTokenRequestSchema,
) {}

export class ApiCreateTokenResponse {
  bearerToken: string;
}
