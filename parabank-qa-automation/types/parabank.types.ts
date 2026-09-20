export interface AccountResponse {
  id: number;
  customerId: number;
  type: string;
  balance: number;
}

export interface CustomerDetails {
  id: number;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  ssn: string;
}
