import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CategoryStore, ICategoryState } from './category.store';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryQuery extends Query<ICategoryState> {
  selectCategories$: any;
  selectPage$: any;
  selectTake$: any;
  selectTotal$: any;

  constructor(protected store: CategoryStore) {
    super(store);

    this.selectCategories$ = this.select('items');
    this.selectPage$ = this.select('meta').pipe(map(meta => meta.currentPage));
    this.selectTake$ = this.select('meta').pipe(map(meta => meta.itemsPerPage));
    this.selectTotal$ = this.select('meta').pipe(map(meta => meta.totalItems));
  }
}
