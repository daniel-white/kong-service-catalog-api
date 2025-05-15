import { AbstractEntity } from '../../../database/entities';
import { Tag, TaggedID, TenantTag } from '../../../core/identifiers';
import { Column, DataSource, Entity, ManyToOne, Unique } from 'typeorm';
import { TenantID, TenantName } from '../../types';

@Entity({ name: 'tenants' })
@Unique(['name'])
export class TenantEntity extends AbstractEntity<TenantTag, TenantID> {
  protected get tag(): TenantTag {
    return 'tnt';
  }

  @Column({ length: 255 })
  public name: TenantName;
}

export const TenantsRepository = 'TenantsRepository';

export const tenantsRepositoryProvider = {
  provide: TenantsRepository,
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
