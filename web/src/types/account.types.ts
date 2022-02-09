/** Authenticated account */
export interface IAuthAccount {
  email: string;
  name: string | null;
  id: string;
  verifiedAt: string;
}

/** Account creation payload */
export interface IAccountCreate {
  email: string;
  password: string;
}
