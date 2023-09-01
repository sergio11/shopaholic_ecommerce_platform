import { IBaseMetaAttribute, IImage } from './base.interface';

export interface ICreateCategory extends IBaseMetaAttribute {
  name?: string;
  image?: File;
  description?: string;
}

export interface ICategory extends IBaseMetaAttribute { 
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image?: IImage;
  description: string;
}