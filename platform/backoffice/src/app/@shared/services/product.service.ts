import { HttpClient } from '@angular/common/http';
import { IBaseAttributeFilterQuery } from './../interfaces/base.interface';
import { ICreateProduct } from './../interfaces/product.interface';
import { Injectable } from '@angular/core';
import { ProductsStore } from './../stores/products/products.store';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { baseAttributeFilterQueryUtils } from '../utils/filterquery.utils';

/**
 * Service responsible for managing products.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {

  /**
   * Endpoint URL for products.
   */
  private readonly END_POINT = `${environment.API_ENDPOINT}products/`;

  /**
   * Field name for product name.
   */
  private readonly PRODUCT_NAME_FIELD = "name";

  /**
   * Field name for product description.
   */
  private readonly PRODUCT_DESCRIPTION_FIELD = "description";

  /**
   * Field name for product price.
   */
  private readonly PRODUCT_PRICE_FIELD = "price";

  /**
   * Field name for product category ID.
   */
  private readonly PRODUCT_CATEGORY_FIELD = "idCategory";

  /**
   * Field name for product brand ID.
   */
  private readonly PRODUCT_BRAND_FIELD = "idBrand";

  /**
   * Field name for product code.
   */
  private readonly PRODUCT_CODE_FIELD = "productCode";

  /**
   * Field name for product stock.
   */
  private readonly PRODUCT_STOCK_FIELD = "stock";

  /**
   * Field name for product main image.
   */
  private readonly PRODUCT_MAIN_IMAGE_FIELD = "mainImageFile";

  /**
   * Field name for product secondary image.
   */
  private readonly PRODUCT_SECONDARY_IMAGE_FIELD = "secondaryImageFile";

  constructor(
    private readonly http: HttpClient,
    private productsStore: ProductsStore
  ) {}

  /**
   * Searches for products based on the provided query options.
   * @param option Query options for filtering products.
   * @returns An observable emitting the search results.
   */
  search(option: IBaseAttributeFilterQuery) {
    return this.http
      .get(`${this.END_POINT}search?${baseAttributeFilterQueryUtils(option)}`)
      .pipe(
        tap((data) => {
          this.productsStore.update(data);
        })
      );
  }

  /**
   * Creates a new product.
   * @param payload The payload containing product information.
   * @returns An observable emitting the created product.
   */
  create(payload: ICreateProduct) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}`, formData).pipe(
      tap((data: any) => {
        this.productsStore.addItem(data);
      })
    );
  }

  /**
   * Updates an existing product.
   * @param id The ID of the product to update.
   * @param payload The payload containing updated product information.
   * @returns An observable emitting the updated product.
   */
  update(id: string, payload: ICreateProduct) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}${id}`, formData).pipe(
      tap((data: any) => {
        this.productsStore.updateItem(data);
      })
    );
  }
  
  /**
   * Deletes a product.
   * @param id The ID of the product to delete.
   * @returns An observable emitting the result of the deletion.
   */
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.productsStore.removeItem(id);
      })
    );
  }

  /**
   * Creates a form data object from the provided payload.
   * @param payload The payload containing product information.
   * @returns A FormData object containing the product data.
   */
  private createFormData(payload: ICreateProduct): FormData {
    const formData = new FormData();
    if (payload.name && payload.name !== undefined) {
      formData.append(this.PRODUCT_NAME_FIELD, payload.name);
    }
    if (payload.description && payload.description !== undefined) {
      formData.append(this.PRODUCT_DESCRIPTION_FIELD, payload.description);
    }
    if (payload.brandId && payload.brandId !== undefined) {
      formData.append(this.PRODUCT_BRAND_FIELD, payload.brandId);
    }
    if (payload.categoryId && payload.categoryId !== undefined) {
      formData.append(this.PRODUCT_CATEGORY_FIELD, payload.categoryId);
    }
    if (payload.price && payload.price !== undefined) {
      formData.append(this.PRODUCT_PRICE_FIELD, payload.price.toString());
    }
    if (payload.productCode && payload.productCode !== undefined) {
      formData.append(this.PRODUCT_CODE_FIELD, payload.productCode);
    }
    if (payload.mainImage && payload.mainImage instanceof File) {
      formData.append(this.PRODUCT_MAIN_IMAGE_FIELD, payload.mainImage);
    }
    if (payload.stock && payload.stock !== undefined) {
      formData.append(this.PRODUCT_STOCK_FIELD, payload.stock.toString());
    }
    if (payload.secondaryImage && payload.secondaryImage instanceof File) {
      formData.append(this.PRODUCT_SECONDARY_IMAGE_FIELD, payload.secondaryImage);
    }
    return formData;
  }
}