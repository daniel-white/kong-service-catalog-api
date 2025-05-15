import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ServicesDataService } from '../services/data/dataService';
import {
  ApiCreateServiceVersionRequest,
  ApiCreateServiceVersionResponse,
  ApiServiceParams,
} from './types';
import { NotFoundError } from '../../core/errors';
import { UseZodGuard } from 'nestjs-zod';
import { ServiceID } from '../types';
import { ClientContextService } from '../../auth/services/context/clientContextService';

@Controller('services/:serviceId/versions')
@UseZodGuard('params', ApiServiceParams)
export class ServiceVersionsController {
  constructor(
    private readonly dataService: ServicesDataService,
    private readonly clientContextService: ClientContextService,
  ) {}

  @Post()
  @UseZodGuard('body', ApiCreateServiceVersionRequest)
  async createService(
    @Param() params: ApiServiceParams,
    @Body() request: ApiCreateServiceVersionRequest,
  ): Promise<ApiCreateServiceVersionResponse> {
    if (
      !this.clientContextService.isAuthenticated ||
      !['tenant-admin', 'root'].includes(this.clientContextService.role)
    ) {
      throw new ForbiddenException();
    }

    return this.dataService
      .createServiceVersion({
        serviceId: params.serviceId as ServiceID,
        version: request.version,
      })
      .map((serviceVersion) => ({
        id: serviceVersion.id,
        tenantId: serviceVersion.tenantId,
        serviceId: serviceVersion.serviceId,
        version: serviceVersion.version,
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
