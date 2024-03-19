import {
  IBaseAttributeFilterQuery,
  IBaseFilterQuery,
} from './../interfaces/base.interface';

export const baseFilterQueryUtils = (option: IBaseFilterQuery) => {
  return `${option.searchTerm ? `term=${option.searchTerm}` : ''}&${option.page ? `page=${option.page}` : ''}&${option.take ? `limit=${option.take}` : ''}`;
};


export const baseAttributeFilterQueryUtils = (
  option: IBaseAttributeFilterQuery
) => {
  const queryParams = [
    option.searchTerm ? `term=${option.searchTerm}` : '',
    option.page ? `page=${option.page}` : '',
    option.take ? `limit=${option.take}` : '',
    option.isFeatured ? `isFeatured=${option.isFeatured}` : '',
    option.isActive ? `isActive=${option.isActive}` : '',
    option.isPopular ? `isPopular=${option.isPopular}` : '',
    option.isHot ? `isHot=${option.isHot}` : '',
    option.isNew ? `isNew=${option.isNew}` : '',
  ];
  return queryParams.filter(param => param !== '').join('&');
};
