import { IImage } from "./base.interface";

export interface ISaveBrand {
  name: string;
  slug: string,
  image?: File;
}

export interface IBrand {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image?: IImage;
  slug: string;
}