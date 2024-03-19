
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CustomerStore, ICustomerState } from './customers.store';

@Injectable({
  providedIn: 'root',
})
export class CustomersQuery extends Query<ICustomerState> {
  constructor(protected store: CustomerStore) {
    super(store);
  }
}
