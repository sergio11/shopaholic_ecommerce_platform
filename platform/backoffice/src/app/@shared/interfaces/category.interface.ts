import { IBaseMetaAttribute } from './base.interface';

export interface ICreateCategory extends IBaseMetaAttribute {
  name?: string;
  image?: File;
  description?: string;
}
