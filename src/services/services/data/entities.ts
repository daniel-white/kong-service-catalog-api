import { TaggedID } from '../../../core/identifiers';
import { Column, DataSource, Entity, Unique } from 'typeorm';
import { TenantOwnedEntity } from '../../../tenants/services/data/entities';
import { ServiceDescription, ServiceName } from 'src/services/types';

type ServiceTag = 'svc';
export type ServiceID = TaggedID<ServiceTag>;

@Entity({ name: 'services' })
@Unique(['name', 'tenant'])
export class ServiceEntity extends TenantOwnedEntity<ServiceTag, ServiceID> {
  protected get tag(): ServiceTag {
    return 'svc';
  }

  @Column({ length: 255 })
  public name: ServiceName;

  @Column({ length: 2048 })
  public description: ServiceDescription;
}

export const ServicesRepository = 'ServicesRepository';

export const servicesRepositoryProvider = {
  provide: ServicesRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ServiceEntity);
  },
  inject: [DataSource],
};
