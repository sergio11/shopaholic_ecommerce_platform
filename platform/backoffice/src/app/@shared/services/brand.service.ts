import { BrandStore } from './../stores/brands/brand.store';
import { HttpClient } from '@angular/common/http';
import { IBaseFilterQuery } from './../interfaces/base.interface';
import { ISaveBrand } from './../interfaces/brand.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly END_POINT = `${environment.API_ENDPOINT}brands/`;
  private readonly BRAND_NAME_FIELD = 'name';
  private readonly BRAND_SLUG_FIELD = 'slug';
  private readonly BRAND_IMAGE_FIELD = 'imageFile';

  constructor(
    private readonly http: HttpClient,
    private brandStore: BrandStore
  ) {}

  filter(option: IBaseFilterQuery) {
    // Create an object to hold the query parameters
    const queryParams: { [param: string]: string } = {};

    // Add the 'term' parameter if defined and not null
    if (option.searchTerm) {
      queryParams['term'] = option.searchTerm;
    }

    // Add the 'page' parameter if defined and not null
    if (option.page !== undefined && option.page !== null) {
      queryParams['page'] = option.page.toString();
    }

    // Add the 'limit' parameter if defined and not null
    if (option.take !== undefined && option.take !== null) {
      queryParams['limit'] = option.take.toString();
    }

    // Build the URL with the query parameters
    const url = this.END_POINT + 'search';

    // Use the HttpClient `params` option to pass the query parameters
    return this.http.get(url, { params: queryParams }).pipe(
      tap((data: any) => {
        this.brandStore.update(data);
      })
    );
  }

  create(payload: ISaveBrand) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}`, formData).pipe(
      tap((data: any) => {
        this.brandStore.addItem(data)
      })
    );
  }

  update(id: string, payload: ISaveBrand) {
    const formData = this.createFormData(payload);
    return this.http.post(`${this.END_POINT}${id}`, formData).pipe(
      tap((data: any) => {
        this.brandStore.updateItem(data);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.brandStore.removeItem(id);
      })
    );
  }

  /**
   * Creates a FormData object and attaches fields, including the image if present.
   * @param payload Category data, including the image.
   * @returns FormData object with attached fields.
   */
  private createFormData(payload: ISaveBrand): FormData {
    const formData = new FormData();
    if (payload.name && payload.name !== undefined) {
      formData.append(this.BRAND_NAME_FIELD, payload.name);
    }
    if (payload.slug && payload.slug !== undefined) {
      formData.append(this.BRAND_SLUG_FIELD, payload.slug);
    }
    if (payload.image && payload.image instanceof File) {
      formData.append(this.BRAND_IMAGE_FIELD, payload.image);
    }
    return formData;
  }
}
