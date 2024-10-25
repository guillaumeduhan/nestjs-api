# Tax-API-v4

Repository containing the Tax Allocation API only for internal requests. Built with NestJS, Passport, & Supabase.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Variables](#env)
- [API Prefix](#prefix)
- [Ping Endpoint](#ping)
- [Authentication](#authentication)
- [Swagger Documentation](#swagger)
- [Guides](#guides)
  - [Create a New Route](#create-a-new-route)
  - [Modules, Controllers & Services](#modules-controllers--services)
- [Taxes](#taxes)
  - [Routes (Deprecated)](#routes-old-version-probably-deprecated)
- [Taxes Calculator Service](#taxes-calculator-service)

## Getting started
For now, the API does not have a Docker image and runs only on the terminal.
Install + dev environment, please use ``make dev`` to use daemon (or watcher):
```
yarn && make dev
```
### Env
Copy/paste ``.env.example`` to ``.env.local`` or ``.env`` with keys:
```
PORT=4200
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
```

### Prefix
By default, API is prefixed with ``/v4`` which means you call ``http(s)://XXXX/v4/...``

### Ping
```
curl --request GET \ --url http://localhost:4200/v4/ping
```

## Authentication
The general authentication is done through Supabase. You can find everything in ``auth/supabase``.
You need to use a Bearer token provided by Supabase in order to make requests.

### Strategy
**All routes must be protected by Supabase** except for the account creation route.
- The user sends their email/password and Supabase signs the returned access token to initiate the session on the Front-End side.
- On the Front-End, the client sets the token and calls auth/me to retrieve the current user profile. From then on, they can make calls to this API with their token as long as it is valid.


## Swagger
Available on:
```
http://localhost:4200/swagger
```
# Guides

### Create a new route

I created a Makefile with a shortcut to make it easier for you to create a new route.
So, to create a new route, for example ``deals`` you can type:
```
make new NAME=deals

// will create folder src/routes/deals
// + files controller, module & service associated in folder
// + import module in app.module.ts (root)
```

note here that NAME= is mandatory variable to create the folder.

### Modules, controllers & services

Summary:
- **Modules**: Organizational units defined with @Module.
- **Controllers**: Handle HTTP requests using @Controller.
- **Services**: Contain business logic, marked with @Injectable.
- **Main Module**: Root module importing other modules.
- **Main Entry Point**: main.ts bootstraps the application.
- 
#### Modules
Modules are the organizational units of Nest.js applications.
```
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  imports: [], // Other modules to import
  controllers: [CatsController], // Controllers within this module
  providers: [CatsService], // Providers (services) within this module
})
export class CatsModule {}
```
#### Controllers
Controllers handle incoming HTTP requests and return responses.
```
import { Controller, Get, Req, Params } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

    // this is where auth is handled for every route
  @Get('path/to/:route')
  findAll(@Request() req, @Param() params:any): string {
    return this.catsService.findAll();
  }
}
```
#### Services
Services handle business logic and data access.
```
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

## Taxes

### Routes (old version, probably deprecated)

| Pathname                                               | Description                                                                     |
|--------------------------------------------------------|---------------------------------------------------------------------------------|
| `/taxes/at-regen/{entitiesId}/2022`                    | Regenerates tax data from Airtable for a given entity and tax year (2022).      |
| `/taxes/batches/{batchNumber}/{taxYear}/import`        | Imports taxes for entities based on a batch number and tax year.                |
| `/taxes/calculator/current-version`                    | Retrieves the current version of the Taxes Calculator.                          |
| `/taxes/create-records/{entityId}/{taxYear}`           | Creates new entity and investment tax records for a given tax year.             |
| `/taxes/entities/{entityId}/create-client`             | Creates a client record for an entity in the tax system.                        |
| `/taxes/entities/{entityId}/ledger`                    | Creates a new ledger entry for an entity.                                       |
| `/taxes/entities/{entityId}/{taxYear}/approve`         | Approves tax filings for an entity for a specific year.                         |
| `/taxes/entities/{entityId}/{taxYear}/import`          | Imports entities for tax return 1065 or a specific tax year.                    |
| `/taxes/entities/{entityId}/{taxYear}/print`           | Prints the 1065 tax form or tax records for a specific entity and tax year.     |
| `/taxes/entities/{taxYear}/incomplete-count`           | Returns the count of incomplete tax filings for a specific year.                |
| `/taxes/entities/create-base-returns`                  | Creates base returns for eligible entities in the tax system.                   |
| `/taxes/entities/create-clients`                       | Creates multiple client records for eligible entities.                          |
| `/taxes/entities/{entitiesTaxesId}/1065-upload`        | Uploads 1065 files for a given entity tax ID.                                   |
| `/taxes/entities/{entitiesTaxesId}/export`             | Exports data from existing Tax System into Supabase.                            |
| `/taxes/entities/{entitiesTaxesId}/import`             | Imports entities for tax return 1065.                                           |
| `/taxes/entities/{entitiesTaxesId}/k1-bulk-upload`     | Uploads K-1 files in bulk for a given entity tax ID.                            |
| `/taxes/entities/{entitiesTaxesId}/print`              | Prints the 1065 tax form for a given entity tax ID.                             |
| `/taxes/forms/8879/{entityId}/{taxYear}/sign`          | Fills and signs Form 8879 for a given entity and tax year.                      |
| `/taxes/get-elf-status/{taxYear}`                      | Retrieves the e-filing status for entities in a specific year.                  |
| `/taxes/import-tax-records-with-status/{status}/{taxYear}`| Imports tax records for entities with a specific status and year.              |
| `/taxes/locked-status/{entityId}/{taxYear}`            | Checks if the tax records for an entity are locked for a given year.            |
| `/taxes/notify-lps`                                    | Sends notifications to limited partners (LPs) with a link to download the K-1s. |
| `/taxes/organizations/{organizationId}/{taxYear}/import`| Imports taxes for all entities in an organization for a given tax year.         |
| `/taxes/provider-partners/{entityId}/{taxYear}`        | Retrieves the provider partners for an entity for a specific tax year.          |
| `/taxes/pull-ending-capital/{entityId}/{taxYear}`      | Pulls ending capital amounts for an entity for a specific tax year.             |
| `/taxes/rollback/{entityId}/{taxYear}/{rollbackVersion}`| Rolls back entity taxes to a specified version.                                 |
| `/taxes/sync-locked-status/{taxYear}`                  | Synchronizes the locked status of tax records for a given year.                 |
| `/taxes/update-tax-records/{taxYear}`                  | Updates tax records for a specific tax year.                                    |

## Taxes calculator service

Here is the calculation generation service for creating our `entities_taxes` and `investments_taxes` records.

| Function Name                                     | Description                                                                                                           |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `applicableDealContributions`                     | Calculates the total contributions for a given array of deals in a specified tax year, returning confidence reports.  |
| `calculateDealManagementFeesWithReductions`       | Calculates total management fees after reductions, identifying and reporting any invalid overrides in confidence.     |
| `calculateEntityEndingCash`                       | Determines the ending cash balance for an entity, taking prior year data and ledger entries into account.             |
| `calculateEndingLongTermAssets`                   | Computes the ending balance of long-term assets for an entity based on deals closed within a specific tax year.       |
| `calculateInvestorContribution`                   | Calculates investor contributions and ownership for a given investment, considering prior year records if available.  |
| `calculateInvestorForeignTaxCreditLimitationApplicable` | Returns whether a foreign tax credit limitation applies to the investor, defaulting to `false`.                       |
| `calculateOwnershipPercentage`                    | Computes the ownership percentage based on investor and total deal contributions.                                      |
| `createEntityTaxRecord`                           | Creates an entity tax record for a specified year, incorporating calculations for cash, assets, and liabilities.      |
| `createInvestmentTaxRecordForYear`                | Generates a tax record for an investment for a given year, using various contribution and expense data.               |
| `createTaxRecordsForYear`                         | Builds a tax record bundle for an entity for a specific year, incorporating multiple records and a confidence report. |
| `dealContributions`                               | Calculates the contributions for a set of deals over a given tax year, providing confidence reporting.                |
| `getEntityExpenses`                               | Retrieves and calculates entity expenses for a specified year, optionally using prior year records as a baseline.     |
| `getPriorYearEntityTaxRecord`                     | Fetches the prior year tax record for an entity, if available, with confidence reporting.                             |
| `getPriorYearInvestmentTaxRecord`                 | Retrieves the previous year’s tax record for an investment, if available.                                             |
| `generate1065SnapshotData`                        | Produces snapshot data for Form 1065, including assets, liabilities, and capital accounts, using a tax record.        |
| `hoistConfidenceReports`                          | Aggregates multiple confidence reports, providing an average confidence score and merged drop reasons.                |
| `useNumericValue`                                 | Returns the first valid numeric value from a list of inputs, or a specified default value if none are found.          |
| `useValue`                                        | Returns the first non-empty string from a list of inputs, or `null` if none are found.                                |
