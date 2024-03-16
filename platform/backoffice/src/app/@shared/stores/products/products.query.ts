
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IProductState, ProductsStore } from './products.store';

@Injectable({
  providedIn: 'root',
})
export class ProductsQuery extends Query<IProductState> {
  constructor(protected store: ProductsStore) {
    super(store);
  }
}
