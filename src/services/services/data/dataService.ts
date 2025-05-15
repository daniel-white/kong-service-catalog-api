import { ResultAsync } from 'neverthrow';
import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  ServicesRepository,
  ServiceEntity,
  ServiceVersionID,
  ServiceVersionsRepository,
  ServiceVersionEntity,
} from './entities';
import { Repository } from 'typeorm';
import { ServiceDescription, ServiceID, ServiceName } from '../../types';
import { NotFoundError } from '../../../core/errors';
import { TenantID } from '../../../tenants/types';
import { ClientContextService } from 'src/auth/services/context/clientContextService';
import { ZodSemver } from 'zod-semver';

export interface Service {
  id: ServiceID;
  tenantId: TenantID;
  name: ServiceName;
  description: ServiceDescription;
}

export interface GetServiceRequest {
  id: ServiceID;
  includeVersions: boolean;
}

export type GetServiceResponse = Service & {
  versions?: ServiceVersion[];
};

export type ListServicesRequest = {
  filter?: string;
  sortBy: 'name' | 'lastUpdated';
  sortOrder: 'ASC' | 'DESC';
  limit?: number;
  after?: ServiceID;
};

export type ListServicesResponse = {
  items: Service[];
};

export interface CreateServiceRequest {
  name: ServiceName;
  description?: ServiceDescription;
}

export type CreateServiceResponse = Service;

export type ServiceVersion = {
  id: ServiceVersionID;
  tenantId: TenantID;
  serviceId: ServiceID;
  version: string;
};

export interface CreateServiceVersionRequest {
  serviceId: ServiceID;
  version: ZodSemver;
}

export type CreateServiceVersionResponse = ServiceVersion;

export class ServiceNotFoundError extends NotFoundError {}

export class ServiceVersionNotFoundError extends NotFoundError {}

@Injectable({
  scope: Scope.REQUEST,
})
export class ServicesDataService {
  constructor(
    @Inject(ServicesRepository)
    private readonly servicesRepository: Repository<ServiceEntity>,
    @Inject(ServiceVersionsRepository)
    private readonly serviceVersionsRepository: Repository<ServiceVersionEntity>,
    private readonly clientContextService: ClientContextService,
  ) {}

  getService(
    request: GetServiceRequest,
  ): ResultAsync<GetServiceResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenantId = this.clientContextService.tenantId;
        if (!tenantId) {
          throw new RangeError('No tenant found in client context');
        }

        const query = this.servicesRepository
          .createQueryBuilder('service')
          .innerJoinAndSelect('service.tenant', 'tenant')
          .where('service.id = :serviceId', { serviceId: request.id })
          .andWhere('tenant.id = :tenantId', { tenantId });

        if (request.includeVersions) {
          query.leftJoinAndSelect('service.versions', 'versions');
        }

        const service = await query.getOne();
        if (!service) {
          throw new ServiceNotFoundError('Service not found');
        }

        return {
          id: service.id,
          tenantId: service.tenant.id,
          name: service.name,
          description: service.description,
          versions: request.includeVersions
            ? service.versions?.map((version) => ({
                id: version.id,
                tenantId: service.tenant.id,
                serviceId: service.id,
                version: version.version,
              }))
            : undefined,
        };
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }

  listServices(
    request: ListServicesRequest,
  ): ResultAsync<ListServicesResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenantId = this.clientContextService.tenantId;
        if (!tenantId) {
          throw new RangeError('No tenant found in client context');
        }

        const query = this.servicesRepository
          .createQueryBuilder('service')
          .innerJoinAndSelect('service.tenant', 'tenant')
          .where('tenant.id = :tenantId', { tenantId });

        if (request.after) {
          query.andWhere('service.id > :after', { after: request.after });
        }

        if (request.filter) {
          query.andWhere(
            'service.name LIKE :filter OR service.description LIKE :filter',
            {
              filter: `%${request.filter}%`,
            },
          );
        }

        const sortBy = request.sortBy ?? 'name';
        const sortOrder = request.sortOrder ?? 'ASC';

        query.orderBy(`service.${sortBy}`, sortOrder);

        const limit = Math.min(Math.max(0, request.limit ?? 15), 100);
        query.take(limit);

        const services = await query.getMany();

        return {
          items: services.map((service) => ({
            id: service.id,
            tenantId: service.tenant.id,
            name: service.name,
            description: service.description,
          })),
        };
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }

  createService(
    request: CreateServiceRequest,
  ): ResultAsync<CreateServiceResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenantId = this.clientContextService.tenantId;
        if (!tenantId) {
          throw new RangeError('No tenant found in client context');
        }

        const service = this.servicesRepository.create({
          name: request.name,
          description: request.description ?? '',
          tenant: { id: tenantId },
        });
        const savedService = await this.servicesRepository.save(service);
        return {
          id: savedService.id,
          tenantId: savedService.tenant.id,
          name: savedService.name,
          description: savedService.description,
        };
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }

  createServiceVersion(
    request: CreateServiceVersionRequest,
  ): ResultAsync<CreateServiceVersionResponse, Error> {
    return ResultAsync.fromPromise(
      (async () => {
        const tenantId = this.clientContextService.tenantId;
        if (!tenantId) {
          throw new RangeError('No tenant found in client context');
        }

        const service = await this.servicesRepository.findOne({
          where: { id: request.serviceId, tenant: { id: tenantId } },
        });
        if (!service) {
          throw new ServiceNotFoundError('Service not found');
        }

        const version = this.serviceVersionsRepository.create({
          version: request.version.toString(),
          service,
          tenant: { id: tenantId },
        });
        const savedVersion = await this.serviceVersionsRepository.save(version);
        return {
          id: savedVersion.id,
          tenantId: savedVersion.tenant.id,
          serviceId: savedVersion.service.id,
          version: savedVersion.version,
        };
      })(),
      (err) => {
        if (err instanceof Error) {
          return err;
        }
        return new Error(`Unknown error: ${err as any}`);
      },
    );
  }
}
