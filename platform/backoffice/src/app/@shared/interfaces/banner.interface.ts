import { IBaseFilterQuery, IBaseMetaAttribute } from './base.interface';

import { BannerType } from '../enums';

export interface IFBannerCreate extends IBaseMetaAttribute {
  image: string;
  title: string;
  url: string;
  type: BannerType;
}

export interface IFBannerFilter extends IBaseFilterQuery {
  type?: BannerType;
}
