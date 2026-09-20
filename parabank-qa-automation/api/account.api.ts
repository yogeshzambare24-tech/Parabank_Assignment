import { APIRequestContext } from '@playwright/test';
import { AccountResponse } from '../types/parabank.types';

export class AccountApi {
  constructor(private request: APIRequestContext) {}

  async getCustomerAccountsApi(customerId: number): Promise<AccountResponse[]> {
    const response = await this.request.get(`/parabank/services/bank/customers/${customerId}/accounts`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok()) {
      throw new Error(`Failed to query accounts for customer: ${customerId}`);
    }
    return response.json();
  }

  async createNewAccountApi(
    customerId: number,
    accountType: number = 1,
    fromAccountId: number
  ): Promise<number> {
    const response = await this.request.post(`/parabank/services/bank/createAccount`, {
      params: {
        customerId: customerId,
        newAccountType: accountType, // 1 = CHECKING
        fromAccountId
      },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok()) {
      throw new Error(`Failed to open checking account via service endpoint.`);
    }

    const data = await response.json();
    return data.id;
  }

  async depositFundsApi(accountId: number, amount: number): Promise<void> {
    const response = await this.request.post(`/parabank/services/bank/deposit`, {
      params: {
        accountId: accountId,
        amount: amount
      },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok()) {
      throw new Error(`Failed to execute programmatic backend deposit to account: ${accountId}`);
    }
  }

  async getAccountTransactionsApi(accountId: number): Promise<any> {
    const response = await this.request.get(`/parabank/services/bank/accounts/${accountId}/transactions`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok()) {
      throw new Error(`Failed to query transaction database records for account: ${accountId}`);
    }
    return await response.json();
  }
}
