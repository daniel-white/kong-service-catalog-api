import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
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
import { BadRequestError, NotFoundError } from '../../core/errors';
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
        if (err instanceof BadRequestError) {
          return new BadRequestException(err.message);
        } else if (err instanceof NotFoundError) {
          return new NotFoundException(err.message);
        } else {
          return new InternalServerErrorException(
            'An unexpected error occurred',
          );
        }
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
        if (err instanceof BadRequestError) {
          return new BadRequestException(err.message);
        } else if (err instanceof NotFoundError) {
          return new NotFoundException(err.message);
        } else {
          return new InternalServerErrorException(
            'An unexpected error occurred',
          );
        }
      })
      .match(
        (res) => res,
        (err) => {
          throw err;
        },
      );
  }
}
