import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantsDataService } from '../services/data/dataService';
import {
  ApiCreateTenantRequest,
  ApiCreateTenantResponse,
  ApiGetTenantRequestParams,
  ApiGetTenantResponse,
} from './types';
import { NotFoundError } from '../../core/errors';
import { UseZodGuard } from 'nestjs-zod';
import { TenantID } from '../types';
import { ClientContextService } from '../../auth/services/context/clientContextService';

@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly dataService: TenantsDataService,
    private readonly clientContextService: ClientContextService,
  ) {}

  @Post()
  async createTenant(
    @Body() request: ApiCreateTenantRequest,
  ): Promise<ApiCreateTenantResponse> {
    if (!this.clientContextService.isAuthenticated) {
      throw new ForbiddenException();
    }

    if (this.clientContextService.role !== 'root') {
      throw new UnauthorizedException();
    }

    return this.dataService
      .createTenant({
        name: request.name,
      })
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }

  @Get('my')
  async getMyTenant(): Promise<ApiGetTenantResponse> {
    if (!this.clientContextService.isAuthenticated) {
      throw new ForbiddenException();
    }

    const tenantId = this.clientContextService.tenantId;
    if (!tenantId) {
      throw new NotFoundException();
    }

    return this.dataService
      .getTenant({ id: tenantId })
      .map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
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

  @Get(':id')
  @UseZodGuard('params', ApiGetTenantRequestParams)
  async getTenant(@Param('id') id: TenantID): Promise<ApiGetTenantResponse> {
    if (
      !this.clientContextService.isAuthenticated ||
      this.clientContextService.role === 'root'
    ) {
      throw new ForbiddenException();
    }

    return this.dataService
      .getTenant({ id })
      .map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
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
