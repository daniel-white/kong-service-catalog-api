# Daniel White's service catalog

To run locally, all you should need is Docker with docker-compose. It runs on port 80 by default.

## Endpoints

- `POST /auth/tokens` - Creates a JWT token for a client
- `POST /tenants` - Create a new tenant
- `GET /tenants/my` - Gets the current tenant
- `GET /tenants/{tenant_id}` - Gets a tenant by ID
- `GET /services/{service_id}` - Gets a service by ID
- `GET /services` - Lists all services
- `POST /services` - Creates a new service
- `GET /services/{service_id}` - Gets a service by ID
- `POST /services/{service_id}/versions` - Creates a new version of a service

## Notes

- I implemented a basic authorization system using JWT tokens. The token is passed in the `Authorization` header as a Bearer token. Theres a few roles:
  - `root` - Can do anything in any tenant by specifying the tenant ID as `x-tenant-id` in the header
  - `tenant-admin` - Can create and manage services in their tenant
  - `tenant-viewer` - Can view services
- I used zod for validation. Great library.
- I assumed a multi-tenant environment.
- This is my first time using NestJS and TypeORM but I tried to make it my own.
