import { z } from 'zod';
import {
  serviceDescriptionSchema,
  serviceIdSchema,
  serviceNameSchema,
} from '../types';
import { createZodDto } from 'nestjs-zod';
import { ZodSemver } from 'zod-semver';

export interface ApiService {
  id: string;
  tenantId: string;
  name: string;
  description: string;
}

const ApiCreateServiceRequestSchema = z.object({
  name: serviceNameSchema,
  description: serviceDescriptionSchema.optional(),
});

export class ApiCreateServiceRequest extends createZodDto(
  ApiCreateServiceRequestSchema,
) {}

export type ApiCreateServiceResponse = ApiService;

const ApiGetServiceRequestParamsSchema = z.object({
  id: serviceIdSchema,
});

export class ApiGetServiceRequestParams extends createZodDto(
  ApiGetServiceRequestParamsSchema,
) {}

const ApiGetServiceRequestQueryParamsSchema = z.object({
  includeVersions: z
    .string()
    .optional()
    .refine((value) => value === 'true' || value === 'false', {
      message: 'Value must be a boolean',
    })
    .transform((value) => value === 'true'),
});

export class ApiGetServiceRequestQueryParams extends createZodDto(
  ApiGetServiceRequestQueryParamsSchema,
) {}

export type ApiGetServiceResponse = ApiService & {
  versions?: ApiServiceVersion[];
};

const ApiListServicesRequestQueryParamsSchema = z.object({
  filter: z.string().optional(),
  sortBy: z.enum(['name', 'lastUpdated']).optional().default('name'),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('ASC'),
  limit: z.number().min(1).optional().default(15),
  after: serviceIdSchema.optional(),
});

export class ApiListServicesRequestQueryParams extends createZodDto(
  ApiListServicesRequestQueryParamsSchema,
) {}

export interface ApiServiceVersion {
  id: string;
  tenantId: string;
  serviceId: string;
  version: string;
}

const ApiCreateServiceVersionRequestSchema = z.object({
  version: ZodSemver,
});

export class ApiCreateServiceVersionRequest extends createZodDto(
  ApiCreateServiceVersionRequestSchema,
) {}

export type ApiCreateServiceVersionResponse = ApiServiceVersion;

const ApiServiceParamsSchema = z.object({
  serviceId: serviceIdSchema,
});

export class ApiServiceParams extends createZodDto(ApiServiceParamsSchema) {}
