import { APIRequestContext } from '@playwright/test';

export class AdminApi {
  constructor(private request: APIRequestContext) {}

  async resetDatabaseAndSetLoanProvider() {
    // Clean the stateful database via backend API endpoint
    const cleanResponse = await this.request.post('/parabank/services/bank/initializeDB');
    if (!cleanResponse.ok()) {
      throw new Error('Failed to programmatically reset the ParaBank database state.');
    }

    // Set the global Loan Provider configuration to Web Service
    const configResponse = await this.request.post('/parabank/services/bank/setParameter/loanProvider/ws');
    if (!configResponse.ok()) {
      throw new Error('Failed to set global Loan Provider configuration parameters.');
    }
  }
}
