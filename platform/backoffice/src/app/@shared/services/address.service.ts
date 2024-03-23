import { HttpClient } from '@angular/common/http';
import { IBaseFilterQuery } from '../interfaces/base.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { baseFilterQueryUtils } from '../utils/filterquery.utils';
import { tap } from 'rxjs/operators';
import { AddressStore } from '../stores/address/address.store';

@Injectable({
  providedIn: 'root',
})
export class AddressService {

  private readonly END_POINT = `${environment.API_ENDPOINT}address/`;

  constructor(
    private readonly http: HttpClient,
    private addressStore: AddressStore
  ) {}

  search(option: IBaseFilterQuery) {
    return this.http.get(`${this.END_POINT}search?${baseFilterQueryUtils(option)}`)
    .pipe(
      tap((data) => {
        this.addressStore.update(data);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.addressStore.removeItem(id);
      })
    );
  }
}
