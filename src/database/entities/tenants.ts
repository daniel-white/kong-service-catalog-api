import { AbstractEntity } from './abstract';
import { TaggedID } from '../../core/identifiers';
import { Column, DataSource, Entity } from 'typeorm';

type TenantTag = 'tnt';
export type TenantID = TaggedID<TenantTag>;

@Entity({ name: 'tenants' })
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
