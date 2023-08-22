import { IFBaseMetaAttribute } from './base.interface';

export interface IFBrand extends IFBaseMetaAttribute {
  name: string;
  slug: string,
  image?: File;
}
