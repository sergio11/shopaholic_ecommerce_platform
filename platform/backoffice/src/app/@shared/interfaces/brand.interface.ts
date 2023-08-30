import { IBaseMetaAttribute } from './base.interface';

export interface IFBrand extends IBaseMetaAttribute {
  name: string;
  slug: string,
  image?: File;
}
