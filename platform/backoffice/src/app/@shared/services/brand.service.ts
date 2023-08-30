import { BrandStore } from './../stores/brands/brand.store';
import { HttpClient } from '@angular/common/http';
import { IBaseFilterQuery } from './../interfaces/base.interface';
import { IBaseResponse } from 'src/app/@shared/interfaces/base.interface';
import { IFBrand } from './../interfaces/brand.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly END_POINT = `${environment.API_ENDPOINT}brands/`;
  constructor(
    private readonly http: HttpClient,
    private brandStore: BrandStore
  ) {}

  filter(option: IBaseFilterQuery) {
    return this.http
      .get(
        `${this.END_POINT}search?term=${option.searchTerm || ''}&page=${
          option.page || ''
        }&limit=${option.take || ''}`
      )
      .pipe(
        tap((bannerResponse: IBaseResponse) => {
          this.brandStore.update(bannerResponse);
        })
      );
  }

  create(payload: IFBrand) {
    return this.http.post(`${this.END_POINT}`, payload).pipe(
      tap((banner: IBaseResponse) => {
        this.brandStore.createBanner(banner?.data);
      })
    );
  }
  update(id: string, payload: IFBrand) {
    return this.http.put(`${this.END_POINT}${id}`, payload).pipe(
      tap((banner: IBaseResponse) => {
        this.brandStore.updateBanner(banner?.data);
      })
    );
  }
  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`).pipe(
      tap((banner: IBaseResponse) => {
        this.brandStore.deleteBanner(banner?.data?.id);
      })
    );
  }
}
