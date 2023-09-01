import { Injectable } from '@angular/core';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { StoreConfig } from '@datorama/akita';
import { ICategory } from '../../interfaces/category.interface';

export interface ICategoryState extends EntityState<ICategory> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'categories' })
export class CategoryStore extends GenericCrudStore<ICategory> {}
