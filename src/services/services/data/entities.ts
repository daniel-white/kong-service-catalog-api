import {
  ServiceTag,
  ServiceVersionTag,
  TaggedID,
} from '../../../core/identifiers';
import {
  Column,
  DataSource,
  Entity,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { TenantOwnedEntity } from '../../../tenants/services/data/entities';
import { ServiceDescription, ServiceName } from 'src/services/types';

export type ServiceID = TaggedID<ServiceTag>;
export type ServiceVersionID = TaggedID<ServiceVersionTag>;

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

  @OneToMany(() => ServiceVersionEntity, (version) => version.service)
  public versions: ServiceVersionEntity[];
}

export const ServicesRepository = 'ServicesRepository';

export const servicesRepositoryProvider = {
  provide: ServicesRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ServiceEntity);
  },
  inject: [DataSource],
};

@Entity({ name: 'service_versions' })
@Unique(['version', 'service'])
export class ServiceVersionEntity extends TenantOwnedEntity<
  ServiceVersionTag,
  ServiceVersionID
> {
  protected get tag(): 'ver' {
    return 'ver';
  }

  @Column({ length: 255 })
  public version: string;

  @ManyToOne(() => ServiceEntity, (service) => service.versions)
  public service: ServiceEntity;
}

export const ServiceVersionsRepository = 'ServiceVersionsRepository';

export const serviceVersionsRepositoryProvider = {
  provide: ServiceVersionsRepository,
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(ServiceVersionEntity);
  },
  inject: [DataSource],
};
