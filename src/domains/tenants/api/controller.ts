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
import { TenantsDataService } from '../data/dataService';
import {
  ApiCreateTenantRequest,
  ApiCreateTenantResponse,
  ApiGetTenantResponse,
} from './types';
import { tryParse } from '../../../core/identifiers';
import { BadRequestError, NotFoundError } from '../../../core/errors';

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
  getTenant(@Param('id') id: string): Promise<ApiGetTenantResponse> {
    return tryParse('tnt', id)
      .asyncAndThen((id) => this.dataService.getTenant({ id }))
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
