import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CategoryStore, ICategoryState } from './category.store';

@Injectable({
  providedIn: 'root',
})
export class CategoryQuery extends Query<ICategoryState> {
  constructor(protected store: CategoryStore) {
    super(store);
  }
}

