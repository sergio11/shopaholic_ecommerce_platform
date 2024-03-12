import { HttpClient } from '@angular/common/http';
import { IBaseAttributeFilterQuery } from './../interfaces/base.interface';
import { IBaseResponse } from 'src/app/@shared/interfaces/base.interface';
import { IProductCreate } from './../interfaces/product.interface';
import { Injectable } from '@angular/core';
import { ProductsStore } from './../stores/products/products.store';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { baseAttributeFilterQueryUtils } from '../utils/filterquery.utils';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly END_POINT = `${environment.API_ENDPOINT}products/`;
  constructor(
    private readonly http: HttpClient,
    private productsStore: ProductsStore
  ) {}

  search(option: IBaseAttributeFilterQuery) {
    return this.http
      .get(`${this.END_POINT}search?${baseAttributeFilterQueryUtils(option)}`)
      .pipe(
        tap((bannerResponse: IBaseResponse) => {
          this.productsStore.update(bannerResponse);
        })
      );
  }

  create(payload: IProductCreate) {
    return this.http.post(`${this.END_POINT}`, payload).pipe(
      tap((banner: IBaseResponse) => {
        this.productsStore.createBanner(banner?.data);
      })
    );
  }

  update(id: string, payload: IProductCreate) {
    return this.http.put(`${this.END_POINT}${id}`, payload).pipe(
      tap((banner: IBaseResponse) => {
        this.productsStore.updateBanner(banner?.data);
      })
    );
  }
  
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`).pipe(
      tap((banner: IBaseResponse) => {
        this.productsStore.deleteBanner(banner?.data?.id);
      })
    );
  }
}
