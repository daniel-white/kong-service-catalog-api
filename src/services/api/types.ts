import { z } from 'zod';
import {
  serviceDescriptionSchema,
  serviceIdSchema,
  serviceNameSchema,
} from '../types';
import { createZodDto } from 'nestjs-zod';

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

export type ApiGetServiceResponse = ApiService;

const ApiListServicesRequestQueryParamsSchema = z.object({
  filter: z.string().optional(),
  sortBy: z.enum(['name', 'lastUpdated']).optional().default('name'),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('ASC'),
  limit: z.number().optional().default(15),
  after: serviceIdSchema.optional(),
});

export class ApiListServicesRequestQueryParams extends createZodDto(
  ApiListServicesRequestQueryParamsSchema,
) {}
