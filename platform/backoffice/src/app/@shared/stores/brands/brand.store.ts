import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { IBrand } from '../../interfaces/brand.interface';

export interface IBrandState extends EntityState<IBrand> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'brands' })
export class BrandStore extends GenericCrudStore<IBrand> {}