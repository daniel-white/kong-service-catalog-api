import { z } from 'zod';
import { taggedId, TaggedID } from '../core/identifiers';

export type TenantID = TaggedID<'tnt'>;
export const tenantIdSchema = taggedId('tnt');

export const tenantNameSchema = z.string().min(1).max(255).brand('tenantName');

export type TenantName = z.infer<typeof tenantNameSchema>;
