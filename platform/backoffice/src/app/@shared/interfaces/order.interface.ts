import { IBaseFilterQuery } from './base.interface';
export interface IOrderFilter extends IBaseFilterQuery {}

interface IClient {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    lastname: string;
    email: string;
    phone: string | null;
    country: string | null;
    language: string;
    city: string | null;
    birthDate: string | null;
    gender: string | null;
  }
  
  export interface IOrder extends IBaseFilterQuery {
    id: string;
    createdAt: string;
    updatedAt: string;
    client: IClient;
    status: string;
  }
