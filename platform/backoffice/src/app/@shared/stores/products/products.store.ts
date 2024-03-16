import { Injectable } from '@angular/core';
import { EntityState, GenericCrudStore } from '../core/generic-crud-store';
import { StoreConfig } from '@datorama/akita';
import { IProduct } from '../../interfaces/product.interface';

export interface IProductState extends EntityState<IProduct> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'products' })
export class ProductsStore extends GenericCrudStore<IProduct> {}