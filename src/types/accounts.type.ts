export interface CreateAccountPayload {
    name: string;
    type: string;
    balance: number;
}

export interface UpdateAccountPayload {
  id: string;
  data: {
    name: string;
    type: string;
    // balance: number;
  };
}