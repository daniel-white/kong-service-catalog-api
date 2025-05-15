import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ServicesDataService } from '../services/data/dataService';
import {
  ApiCreateServiceRequest,
  ApiCreateServiceResponse,
  ApiGetServiceRequestParams,
  ApiGetServiceRequestQueryParams,
  ApiGetServiceResponse,
  ApiListServicesRequestQueryParams,
} from './types';
import { NotFoundError } from '../../core/errors';
import { UseZodGuard } from 'nestjs-zod';
import { ServiceID } from '../types';
import { ClientContextService } from '../../auth/services/context/clientContextService';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly dataService: ServicesDataService,
    private readonly clientContextService: ClientContextService,
  ) {}

  @Get(':id')
  @UseZodGuard('params', ApiGetServiceRequestParams)
  @UseZodGuard('query', ApiGetServiceRequestQueryParams)
  async getService(
    @Param('id') id: ServiceID,
    @Query() query: ApiGetServiceRequestQueryParams,
  ): Promise<ApiGetServiceResponse> {
    if (!this.clientContextService.isAuthenticated) {
      throw new ForbiddenException();
    }

    return this.dataService
      .getService({ id, includeVersions: query.includeVersions })
      .map((service) => ({
        id: service.id,
        tenantId: service.tenantId,
        name: service.name,
        description: service.description,
        versions: service.versions?.map((version) => ({
          id: version.id,
          tenantId: version.tenantId,
          serviceId: version.serviceId,
          version: version.version,
        })),
      }))
      .mapErr((err) => {
        if (err instanceof NotFoundError) {
          return new NotFoundException();
        }
        throw err;
      })
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }

  @Get()
  @UseZodGuard('query', ApiListServicesRequestQueryParams)
  async listServices(@Query() query: ApiListServicesRequestQueryParams) {
    if (!this.clientContextService.isAuthenticated) {
      throw new ForbiddenException();
    }

    return this.dataService
      .listServices({
        ...query,
        after: (query.after as ServiceID) ?? undefined,
      })
      .map(({ items }) => ({
        items: items.map((service) => ({
          id: service.id,
          tenantId: service.tenantId,
          name: service.name,
          description: service.description,
        })),
      }))
      .mapErr((err) => {
        if (err instanceof NotFoundError) {
          return new NotFoundException();
        }
        throw err;
      })
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }

  @Post()
  @UseZodGuard('body', ApiCreateServiceRequest)
  async createService(
    @Body() request: ApiCreateServiceRequest,
  ): Promise<ApiCreateServiceResponse> {
    if (
      !this.clientContextService.isAuthenticated ||
      !['tenant-admin', 'root'].includes(this.clientContextService.role)
    ) {
      throw new ForbiddenException();
    }

    return this.dataService
      .createService({
        name: request.name,
        description: request.description,
      })
      .map((service) => ({
        id: service.id,
        tenantId: service.tenantId,
        name: service.name,
        description: service.description,
      }))
      .mapErr((err) => {
        if (err instanceof NotFoundError) {
          return new NotFoundException();
        }
        throw err;
      })
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }
}
