import { z } from 'zod';
import { taggedId, TaggedID } from '../core/identifiers';

export type ServiceID = TaggedID<'svc'>;
export const serviceIdSchema = taggedId('svc');

export const serviceNameSchema = z
  .string()
  .min(1)
  .max(255)
  .brand('serviceName');

export type ServiceName = z.infer<typeof serviceNameSchema>;

export const serviceDescriptionSchema = z
  .string()
  .max(2048)
  .brand('serviceDescription');

export type ServiceDescription = z.infer<typeof serviceDescriptionSchema>;
