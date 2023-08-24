import { HttpClient } from '@angular/common/http';
import { IFBaseAttributeFilterQuery } from './../interfaces/base.interface';
import { IFBaseResponse } from 'src/app/@shared/interfaces/base.interface';
import { IFProductCreate } from './../interfaces/product.interface';
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

  search(option: IFBaseAttributeFilterQuery) {
    return this.http
      .get(`${this.END_POINT}search?${baseAttributeFilterQueryUtils(option)}`)
      .pipe(
        tap((bannerResponse: IFBaseResponse) => {
          this.productsStore.update(bannerResponse);
        })
      );
  }

  create(payload: IFProductCreate) {
    return this.http.post(`${this.END_POINT}`, payload).pipe(
      tap((banner: IFBaseResponse) => {
        this.productsStore.createBanner(banner?.data);
      })
    );
  }
  update(id: string, payload: IFProductCreate) {
    return this.http.put(`${this.END_POINT}${id}`, payload).pipe(
      tap((banner: IFBaseResponse) => {
        this.productsStore.updateBanner(banner?.data);
      })
    );
  }
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`).pipe(
      tap((banner: IFBaseResponse) => {
        this.productsStore.deleteBanner(banner?.data?.id);
      })
    );
  }
}
