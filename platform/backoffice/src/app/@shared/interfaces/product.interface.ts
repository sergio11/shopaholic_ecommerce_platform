import { IBaseMetaAttribute } from "./base.interface";

export interface ICreateProduct {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stock?: number;
  productCode?: string;
  brandId?: string; 
  mainImage?: File;
  secondaryImage?: File
}

interface IFile {
  id: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

interface ICategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

interface IBrand {
  id: string;
  name: string;
  slug: string;
}

export interface IProduct extends IBaseMetaAttribute { 
  id: string;
  name: string;
  description: string;
  mainImage: IFile;
  secondaryImage: IFile;
  category: ICategory;
  price: number;
  stock: number;
  productCode: string;
  brand: IBrand;
  averageRating: number;
  likesCount: number;
  dislikesCount: number;
  isBestRated: boolean;
  isWorstRated: boolean;
}