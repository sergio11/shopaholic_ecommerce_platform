import { IUser } from "./user.interface";

export interface IAddress {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  user: IUser;
}