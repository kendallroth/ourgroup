/** Authenticated account */
export interface IAuthAccount {
  email: string;
  name: string | null;
  id: string;
  verifiedAt: Date;
}

/** Account creation payload */
export interface IAccountCreate {
  email: string;
  password: string;
}
