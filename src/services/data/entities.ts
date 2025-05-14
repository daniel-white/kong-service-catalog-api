import { TaggedID } from '../../core/identifiers';
import { Column, DataSource, Entity, Unique } from 'typeorm';
import { TenantOwnedEntity } from '../../tenants/services/entities';

type ServiceTag = 'svc';
export type ServiceID = TaggedID<ServiceTag>;

@Entity({ name: 'services' })
@Unique(['name', 'tenant'])
export class ServiceEntity extends TenantOwnedEntity<ServiceTag, ServiceID> {
  protected get tag(): ServiceTag {
    return 'svc';
  }

  @Column({ length: 255 })
  public name: string;

  @Column()
  public description: string;
}

export const DatabaseServicesRepository = 'DatabaseServicesRepository';

export const servicesRepositoryProvider = {
  provide: DatabaseServicesRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ServiceEntity);
  },
  inject: [DataSource],
};
