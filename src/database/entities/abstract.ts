import { BeforeInsert, PrimaryColumn as PrimaryColumnBase } from 'typeorm';
import { create, Tag, TaggedID } from '../../core/identifiers';

export function PrimaryColumn(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    const primaryColumn = PrimaryColumnBase('char', { length: 29 });
    primaryColumn(target, propertyKey);
  };
}

export abstract class AbstractEntity<
  TTag extends Tag = Tag,
  TId extends TaggedID<TTag> = TaggedID<TTag>,
> {
  @PrimaryColumn()
  id: TId;

  protected abstract get tag(): TTag;

  @BeforeInsert()
  generateId() {
    this.id = create(this.tag) as TId;
  }
}
