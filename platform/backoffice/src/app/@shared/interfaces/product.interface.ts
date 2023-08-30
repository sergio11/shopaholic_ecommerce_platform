export interface IProductCreate {
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
