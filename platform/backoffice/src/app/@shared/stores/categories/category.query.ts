import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CategoryStore, ICategoryState } from './category.store';

@Injectable({
  providedIn: 'root',
})
export class CategoryQuery extends Query<ICategoryState> {
  selectCategories$;
  selectPage$;
  selectTake$;
  selectTotal$;

  constructor(protected store: CategoryStore) {
    super(store);

    // Inicializar los observables con valores iniciales
    this.selectCategories$ = this.select('data');
    this.selectPage$ = this.select('page');
    this.selectTake$ = this.select('take');
    this.selectTotal$ = this.select('total');
  }
}
