import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TenantsDataService } from '../services/dataService';
import {
  ApiCreateTenantRequest,
  ApiCreateTenantResponse,
  ApiGetTenantRequestParams,
  ApiGetTenantResponse,
} from './types';
import { NotFoundError } from '../../core/errors';
import { UseZodGuard } from 'nestjs-zod';
import { TenantID } from '../types';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly dataService: TenantsDataService) {}

  @Post()
  createTenant(
    @Body() request: ApiCreateTenantRequest,
  ): Promise<ApiCreateTenantResponse> {
    return this.dataService
      .createTenant({
        name: request.name,
      })
      .mapErr((err) => {
        if (err instanceof NotFoundError) {
          return new NotFoundException(err.message);
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
  getTenant(@Param('id') id: TenantID): Promise<ApiGetTenantResponse> {
    return this.dataService
      .getTenant({ id })
      .map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
      }))
      .mapErr((err) => {
        if (err instanceof NotFoundError) {
          return new NotFoundException(err.message);
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
