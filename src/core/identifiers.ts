import { ULID, ulid } from 'ulid';

export type Tag = 'svc' | 'tnt';

export type TaggedID<T extends Tag> = `${T}${ULID}` & { tag: T };

export function create<T extends Tag>(tag: T): TaggedID<T> {
  return `${tag}${ulid()}` as TaggedID<T>;
}
