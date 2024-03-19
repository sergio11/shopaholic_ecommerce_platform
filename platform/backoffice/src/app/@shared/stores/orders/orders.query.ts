
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IOrderState, OrdersStore } from './orders.store';

@Injectable({
  providedIn: 'root',
})
export class OrdersQuery extends Query<IOrderState> {
  constructor(protected store: OrdersStore) {
    super(store);
  }
}
