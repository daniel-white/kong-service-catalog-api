import { ResultAsync } from 'neverthrow';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ServicesRepository, ServiceEntity } from './entities';
import { Repository } from 'typeorm';
import { ServiceDescription, ServiceID, ServiceName } from '../../types';
import { NotFoundError } from '../../../core/errors';
import { TenantID } from '../../../tenants/types';
import { ClientContextService } from 'src/auth/services/context/clientContextService';

export interface Service {
  id: ServiceID;
  tenantId: TenantID;
  name: ServiceName;
  description: ServiceDescription;
}

export interface GetServiceRequest {
  id: ServiceID;
}

export type GetServiceResponse = Service;

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

export class ServiceNotFoundError extends NotFoundError {}

@Injectable({
  scope: Scope.REQUEST,
})
export class ServicesDataService {
  constructor(
    @Inject(ServicesRepository)
    private readonly repository: Repository<ServiceEntity>,
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

        const service = await this.repository
          .createQueryBuilder('service')
          .innerJoin('service.tenant', 'tenant')
          .where('service.id = :serviceId', { serviceId: request.id })
          .andWhere('tenant.id = :tenantId', { tenantId })
          .getOne();

        if (!service) {
          throw new ServiceNotFoundError('Service not found');
        }

        return {
          id: service.id,
          tenantId: service.tenant.id,
          name: service.name,
          description: service.description,
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

        const query = this.repository
          .createQueryBuilder('service')
          .innerJoin('service.tenant', 'tenant')
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
}
