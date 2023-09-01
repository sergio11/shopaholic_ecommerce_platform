import { BrandStore, IBrandState } from './brand.store';

import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})
export class BrandQuery extends Query<IBrandState> {
  constructor(protected store: BrandStore) {
    super(store);
  }
}
