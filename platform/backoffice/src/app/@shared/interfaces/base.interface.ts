export interface IBaseMetaSchema {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IBaseMetaAttribute {
  isFeatured?: boolean;
  isActive?: boolean;
  isPopular?: boolean;
  isHot?: boolean;
  isNew?: boolean;
}

export interface IBaseFilterQuery {
  searchTerm?: string;
  page?: number;
  take?: number;
}
export interface IBaseAttributeFilterQuery extends IBaseMetaAttribute {
  searchTerm?: string;
  page?: number;
  take?: number;
}

export interface IBaseResponse {
  data?: any;
  message?: string;
  success?: boolean;
}
export interface IBaseFilterResponse extends IBaseResponse {
  page?: number;
  take?: number;
  total?: number;
}
