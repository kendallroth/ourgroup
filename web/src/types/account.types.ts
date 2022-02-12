/** Authenticated account */
export interface IAuthAccount {
  id: string;
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

/** Account update payload */
export interface IAccountUpdate {
  name: string;
}
