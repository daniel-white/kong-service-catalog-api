import { ULID, ulid } from 'ulid';
import { z } from 'zod';

export type TenantTag = 'tnt';

export type Tag = 'svc' | TenantTag;

export type TaggedID<T extends Tag> = `${T}${ULID}` & { tag: T };

export function create<T extends Tag>(tag: T): TaggedID<T> {
  return `${tag}${ulid()}` as TaggedID<T>;
}

export function taggedId<T extends Tag>(tag: T) {
  return z.string().startsWith(tag).length(29);
}
