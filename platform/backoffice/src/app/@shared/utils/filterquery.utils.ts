import {
  IFBaseAttributeFilterQuery,
  IFBaseFilterQuery,
} from './../interfaces/base.interface';

export const baseFilterQueryUtils = (option: IFBaseFilterQuery) => {
  return `
    ${option.searchTerm ? `term=${option.searchTerm}` : ''}
    &${option.page ? `page=${option.page}` : ''}
    &${option.take ? `limit=${option.take}` : ''}
  `;
};

export const baseAttributeFilterQueryUtils = (
  option: IFBaseAttributeFilterQuery
) => {
  return `term=${option.searchTerm || ''}&page=${
    option.page || ''
  }&limit=${option.take || ''}&isFeatured=${option.isFeatured || ''}&isActive=${
    option.isActive || ''
  }&isPopular=${option.isPopular || ''}&isHot=${option.isHot || ''}&isNew=${
    option.isNew || ''
  }`;
};
