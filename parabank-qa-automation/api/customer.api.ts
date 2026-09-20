import { APIRequestContext } from '@playwright/test';

export class CustomerApi {
  constructor(private request: APIRequestContext) {}

  async registerUserApi(username: string): Promise<void> {
    const response = await this.request.post(`/parabank/services/bank/customers/register`, {
      params: {
        firstName: 'API',
        lastName: 'Automation',
        street: '456 Backend Road',
        city: 'CloudCity',
        state: 'NY',
        zipCode: '10001',
        phone: '9876543210',
        ssn: '888-88-8888',
        username: username,
        password: 'Password123',
        repeatedPassword: 'Password123'
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to programmatically register API user. Status: ${response.status()}`);
    }
  }

  async getCustomerDetails(username: string): Promise<any> {
    const response = await this.request.get(`/parabank/services/bank/customers/${username}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok()) {
      throw new Error(`Failed to fetch customer profile details for: ${username}`);
    }
    return await response.json();
  }
}
