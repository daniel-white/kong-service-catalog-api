import { AbstractEntity } from './abstract';
import { Tag, TaggedID } from '../../core/identifiers';
import { Column, DataSource, Entity, ManyToOne, Unique } from 'typeorm';

type TenantTag = 'tnt';
export type TenantID = TaggedID<TenantTag>;

@Entity({ name: 'tenants' })
@Unique(['name'])
export class TenantEntity extends AbstractEntity<TenantTag, TenantID> {
  protected get tag(): TenantTag {
    return 'tnt';
  }

  @Column({ length: 255 })
  public name: string;
}

export const DatabaseTenantsRepository = 'DatabaseTenantsRepository';

export const tenantsRepositoryProvider = {
  provide: DatabaseTenantsRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(TenantEntity);
  },
  inject: [DataSource],
};

export abstract class TenantOwnedEntity<
  TTag extends Tag = Tag,
  TId extends TaggedID<TTag> = TaggedID<TTag>,
> extends AbstractEntity<TTag, TId> {
  @ManyToOne(() => TenantEntity, (tenant) => tenant.id)
  public tenant: TenantEntity;
}
