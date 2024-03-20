export interface AuthCredential {
  email: string;
  password: string;
}

export interface RegisterAdmin {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface IFChangePassword {
  id: string;
  oldPassword: string;
  newPassword: string;
}
