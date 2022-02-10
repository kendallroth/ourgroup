/** Authenticated account */
export interface IAuthAccount {
  accountId: string;
  email: string;
  name: string | null;
  verifiedAt: string;
}

/** Account creation payload */
export interface IAccountCreate {
  email: string;
  name: string;
  password: string;
}
