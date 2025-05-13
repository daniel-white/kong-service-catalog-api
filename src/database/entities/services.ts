import { AbstractEntity } from './abstract';
import { TaggedID } from '../../core/identifiers';
import { Column, DataSource, Entity, ManyToOne } from 'typeorm';
import { TenantEntity } from './tenants';

type ServiceTag = 'svc';
export type ServiceID = TaggedID<ServiceTag>;

@Entity({ name: 'services' })
export class ServiceEntity extends AbstractEntity<ServiceTag, ServiceID> {
  protected get tag(): ServiceTag {
    return 'svc';
  }

  @Column({ length: 255 })
  public name: string;

  @Column()
  public description: string;

  @ManyToOne(() => TenantEntity, (tenant) => tenant.id)
  public tenant: TenantEntity;
}

export const DatabaseServicesRepository = 'DatabaseServicesRepository';

export const servicesRepositoryProvider = {
  provide: DatabaseServicesRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ServiceEntity);
  },
  inject: [DataSource],
};
