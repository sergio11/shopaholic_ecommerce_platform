import { IBaseFilterQuery } from './base.interface';
export interface IFChangePhoneNumber {
  oldPhoneNumber?: string;
  newPhoneNumber?: string;
}

type RoleName = 'ADMIN' | 'CLIENT';

export interface IFilterUser extends IBaseFilterQuery {}

export interface IFUserInfo {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
  birthDate?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
}

interface IRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  route: string;
}

export interface IUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  roles: IRole[];
  country: string | null;
  language: string;
  city: string | null;
  birthDate: string | null;
  gender: string | null;
}
