import { HttpClient } from '@angular/common/http';
import { IBaseFilterQuery } from '../interfaces/base.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { baseFilterQueryUtils } from '../utils/filterquery.utils';
import { tap } from 'rxjs/operators';
import { OrdersStore } from '../stores/orders/orders.store';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly END_POINT = `${environment.API_ENDPOINT}orders/`;

  constructor(
    private readonly http: HttpClient,
    private ordersStore: OrdersStore
  ) {}

  search(option: IBaseFilterQuery) {
    return this.http.get(`${this.END_POINT}search?${baseFilterQueryUtils(option)}`)
    .pipe(
      tap((data) => {
        console.log("search orders", data);
        this.ordersStore.update(data);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.END_POINT}${id}/delete`, { responseType: 'text' }).pipe(
      tap(() => {
        this.ordersStore.remove(id);
      })
    );
  }

  cancel(id: string) {
    return this.http.delete(`${this.END_POINT}${id}/cancel`, { responseType: 'text' });
  }
}
