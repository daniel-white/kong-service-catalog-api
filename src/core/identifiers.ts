import { ULID, ulid } from 'ulid';
import { Result, ok, err } from 'neverthrow';
import { BadRequestError } from './errors';

export type Tag = 'svc' | 'tnt';

export type TaggedID<T extends Tag> = `${T}${ULID}` & { tag: T };

export function create<T extends Tag>(tag: T): TaggedID<T> {
  return `${tag}${ulid()}` as TaggedID<T>;
}

export function tryParse<T extends Tag>(
  requiredTag: T,
  id: string,
): Result<TaggedID<T>, Error> {
  const tag = id.slice(0, 3) as T;
  if (tag !== requiredTag) {
    return err(
      new BadRequestError(
        `Invalid ID tag. Expected ${requiredTag}, got ${tag}`,
      ),
    );
  }
  if (id.length !== 29) {
    return err(
      new BadRequestError(`Invalid ID length. Expected 29, got ${id.length}`),
    );
  }
  return ok(id as TaggedID<T>);
}
